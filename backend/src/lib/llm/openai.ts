import type {
    LlmMessage,
    NormalizedToolCall,
    NormalizedToolResult,
    OpenAIToolSchema,
    StreamChatParams,
    StreamChatResult,
} from "./types";

const OPENAI_BASE_URL = "https://api.openai.com/v1";
const MAX_OUTPUT_TOKENS = 16384;
type OpenAIEndpointMode = "responses" | "chat.completions";

type ResponseInputItem =
    | { role: "user" | "assistant"; content: string }
    | { type: "function_call_output"; call_id: string; output: string };

type ResponseFunctionTool = {
    type: "function";
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
};

type ResponseFunctionCallItem = {
    type: "function_call";
    call_id?: string;
    name?: string;
    arguments?: string;
};

type ResponseStreamEvent = {
    type?: string;
    delta?: string;
    response?: { id?: string; output_text?: string };
    item?: ResponseFunctionCallItem;
};

type ChatCompletionToolCallDelta = {
    index?: number;
    id?: string;
    function?: {
        name?: string;
        arguments?: string;
    };
};

type ChatCompletionChunk = {
    choices?: {
        delta?: {
            content?: string;
            reasoning_content?: string;
            tool_calls?: ChatCompletionToolCallDelta[];
        };
    }[];
};

type ChatCompletionToolCall = {
    id: string;
    name: string;
    arguments: string;
};

type ChatCompletionTool = {
    type: "function";
    function: {
        name: string;
        description?: string;
        parameters: Record<string, unknown>;
    };
};

type ChatCompletionMessage =
    | {
          role: "system" | "user" | "assistant";
          content: string;
      }
    | {
          role: "assistant";
          content: string;
          tool_calls: {
              id: string;
              type: "function";
              function: {
                  name: string;
                  arguments: string;
              };
          }[];
      }
    | {
          role: "tool";
          tool_call_id: string;
          content: string;
      };

function apiKey(override?: string | null): string {
    if (override?.trim()) return override.trim();
    if (process.env.OPENAI_COMPAT_BASE_URL?.trim()) {
        return process.env.OPENAI_COMPAT_API_KEY?.trim() || "";
    }
    return (
        process.env.OPENAI_API_KEY?.trim() ||
        process.env.OPENAI_COMPAT_API_KEY?.trim() ||
        ""
    );
}

function normalizeBaseUrl(url: string): string {
    return url.replace(/\/+$/, "");
}

function openAIBaseUrl(): string {
    return normalizeBaseUrl(
        process.env.OPENAI_COMPAT_BASE_URL?.trim() || OPENAI_BASE_URL,
    );
}

function endpointMode(): OpenAIEndpointMode {
    const configured = process.env.OPENAI_COMPAT_ENDPOINT_MODE?.trim();
    if (configured === "responses" || configured === "chat.completions") {
        return configured;
    }
    return process.env.OPENAI_COMPAT_BASE_URL?.trim()
        ? "chat.completions"
        : "responses";
}

function requestHeaders(key: string): Record<string, string> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (key) {
        headers.Authorization = `Bearer ${key}`;
    } else if (!process.env.OPENAI_COMPAT_BASE_URL?.trim()) {
        throw new Error(
            "OPENAI_API_KEY is required when using the hosted OpenAI API",
        );
    }
    return headers;
}

function toResponseTools(tools: OpenAIToolSchema[]): ResponseFunctionTool[] {
    return tools.map((tool) => ({
        type: "function",
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters,
    }));
}

function toResponseInput(messages: LlmMessage[]): ResponseInputItem[] {
    return messages.map((message) => ({
        role: message.role,
        content: message.content,
    }));
}

function toChatCompletionTools(tools: OpenAIToolSchema[]): ChatCompletionTool[] {
    return tools.map((tool) => ({
        type: "function",
        function: {
            name: tool.function.name,
            description: tool.function.description,
            parameters: tool.function.parameters,
        },
    }));
}

function toChatCompletionMessages(
    systemPrompt: string,
    messages: LlmMessage[],
): ChatCompletionMessage[] {
    return [
        { role: "system", content: systemPrompt },
        ...messages.map((message) => ({
            role: message.role,
            content: message.content,
        })),
    ];
}

function extractSseJson(buffer: string): { events: unknown[]; rest: string } {
    const events: unknown[] = [];
    const chunks = buffer.split(/\n\n/);
    const rest = chunks.pop() ?? "";

    for (const chunk of chunks) {
        const dataLines = chunk
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trim());

        for (const data of dataLines) {
            if (!data || data === "[DONE]") continue;
            try {
                events.push(JSON.parse(data));
            } catch {
                // Incomplete events stay buffered until the next read.
            }
        }
    }

    return { events, rest };
}

function parseFunctionCall(item: ResponseFunctionCallItem): NormalizedToolCall {
    let input: Record<string, unknown> = {};
    try {
        const parsed = JSON.parse(item.arguments || "{}");
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            input = parsed as Record<string, unknown>;
        }
    } catch {
        input = {};
    }

    return {
        id: item.call_id ?? item.name ?? "function_call",
        name: item.name ?? "",
        input,
    };
}

function normalizeChatCompletionToolCall(
    call: ChatCompletionToolCall,
): NormalizedToolCall {
    let input: Record<string, unknown> = {};
    try {
        const parsed = JSON.parse(call.arguments || "{}");
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            input = parsed as Record<string, unknown>;
        }
    } catch {
        input = {};
    }

    return {
        id: call.id,
        name: call.name,
        input,
    };
}

async function createResponse(params: {
    model: string;
    input: ResponseInputItem[];
    instructions?: string;
    tools?: ResponseFunctionTool[];
    stream?: boolean;
    maxTokens?: number;
    previousResponseId?: string;
    reasoningSummary?: boolean;
    apiKey: string;
}): Promise<Response> {
    const response = await fetch(`${openAIBaseUrl()}/responses`, {
        method: "POST",
        headers: requestHeaders(params.apiKey),
        body: JSON.stringify({
            model: params.model,
            instructions: params.instructions || undefined,
            input: params.input,
            tools: params.tools?.length ? params.tools : undefined,
            stream: params.stream,
            max_output_tokens: params.maxTokens ?? MAX_OUTPUT_TOKENS,
            previous_response_id: params.previousResponseId,
            reasoning: params.reasoningSummary
                ? { summary: "auto" }
                : undefined,
        }),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        const err = new Error(
            `OpenAI request failed (${response.status}): ${text || response.statusText}`,
        );
        (err as { status?: number }).status = response.status;
        throw err;
    }

    return response;
}

async function createChatCompletion(params: {
    model: string;
    messages: ChatCompletionMessage[];
    tools?: ChatCompletionTool[];
    stream?: boolean;
    maxTokens?: number;
    apiKey: string;
}): Promise<Response> {
    const response = await fetch(`${openAIBaseUrl()}/chat/completions`, {
        method: "POST",
        headers: requestHeaders(params.apiKey),
        body: JSON.stringify({
            model: params.model,
            messages: params.messages,
            tools: params.tools?.length ? params.tools : undefined,
            tool_choice: params.tools?.length ? "auto" : undefined,
            stream: params.stream,
            max_tokens: params.maxTokens ?? MAX_OUTPUT_TOKENS,
        }),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
            `OpenAI-compatible request failed (${response.status}): ${text || response.statusText}`,
        );
    }

    return response;
}

async function streamChatCompletions(
    params: StreamChatParams,
): Promise<StreamChatResult> {
    const {
        model,
        systemPrompt,
        tools = [],
        callbacks = {},
        runTools,
        apiKeys,
    } = params;
    const maxIter = params.maxIterations ?? 10;
    const key = apiKey(apiKeys?.openai);
    const chatTools = toChatCompletionTools(tools);
    const hasTools = chatTools.length > 0;
    let chatMessages = toChatCompletionMessages(systemPrompt, params.messages);
    let fullText = "";

    for (let iter = 0; iter < maxIter; iter++) {
        const response = await createChatCompletion({
            model,
            messages: chatMessages,
            tools: chatTools,
            stream: true,
            apiKey: key,
        });
        if (!response.body) {
            throw new Error("OpenAI-compatible chat completion had no body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const toolCallsByIndex = new Map<number, ChatCompletionToolCall>();
        const startedToolCallIds = new Set<string>();
        let buffer = "";
        let pendingText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const extracted = extractSseJson(buffer);
            buffer = extracted.rest;

            for (const event of extracted.events as ChatCompletionChunk[]) {
                const delta = event.choices?.[0]?.delta;
                if (!delta) continue;

                if (typeof delta.reasoning_content === "string") {
                    callbacks.onReasoningDelta?.(delta.reasoning_content);
                }

                if (typeof delta.content === "string") {
                    pendingText += delta.content;
                    fullText += delta.content;
                    callbacks.onContentDelta?.(delta.content);
                }

                for (const toolDelta of delta.tool_calls ?? []) {
                    const index = toolDelta.index ?? 0;
                    const current = toolCallsByIndex.get(index) ?? {
                        id: toolDelta.id ?? `tool_${index}`,
                        name: "",
                        arguments: "",
                    };

                    if (toolDelta.id) current.id = toolDelta.id;
                    if (toolDelta.function?.name) {
                        current.name = toolDelta.function.name;
                    }
                    if (toolDelta.function?.arguments) {
                        current.arguments += toolDelta.function.arguments;
                    }

                    toolCallsByIndex.set(index, current);

                    if (current.name && !startedToolCallIds.has(current.id)) {
                        startedToolCallIds.add(current.id);
                        callbacks.onToolCallStart?.({
                            id: current.id,
                            name: current.name,
                            input: {},
                        });
                    }
                }
            }
        }

        const toolCalls = [...toolCallsByIndex.entries()]
            .sort(([a], [b]) => a - b)
            .map(([, call]) => call)
            .filter((call) => !!call.name);

        if (!toolCalls.length || !runTools) {
            break;
        }

        const normalizedCalls = toolCalls.map(normalizeChatCompletionToolCall);
        const results = await runTools(normalizedCalls);

        chatMessages = [
            ...chatMessages,
            {
                role: "assistant",
                content: pendingText,
                tool_calls: toolCalls.map((call) => ({
                    id: call.id,
                    type: "function" as const,
                    function: {
                        name: call.name,
                        arguments: call.arguments || "{}",
                    },
                })),
            },
            ...results.map((result) => ({
                role: "tool" as const,
                tool_call_id: result.tool_use_id,
                content: result.content,
            })),
        ];
    }

    return { fullText };
}

export async function streamOpenAI(
    params: StreamChatParams,
): Promise<StreamChatResult> {
    if (endpointMode() === "chat.completions") {
        return streamChatCompletions(params);
    }

    const {
        model,
        systemPrompt,
        tools = [],
        callbacks = {},
        runTools,
        apiKeys,
        enableThinking,
    } = params;
    const maxIter = params.maxIterations ?? 10;
    const key = apiKey(apiKeys?.openai);
    const responseTools = toResponseTools(tools);
    let input = toResponseInput(params.messages);
    let previousResponseId: string | undefined;
    let fullText = "";
    const hasTools = responseTools.length > 0;

    for (let iter = 0; iter < maxIter; iter++) {
        const response = await createResponse({
            model,
            instructions: iter === 0 ? systemPrompt : undefined,
            input,
            tools: responseTools,
            stream: true,
            previousResponseId,
            reasoningSummary: !!enableThinking,
            apiKey: key,
        });
        if (!response.body) throw new Error("OpenAI response had no body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const toolCalls: NormalizedToolCall[] = [];
        const startedToolCallIds = new Set<string>();
        let buffer = "";
        let pendingText = "";
        let sawReasoning = false;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const extracted = extractSseJson(buffer);
            buffer = extracted.rest;

            for (const event of extracted.events as ResponseStreamEvent[]) {
                if (event.response?.id) {
                    previousResponseId = event.response.id;
                }

                if (
                    event.type === "response.reasoning_summary_text.delta" &&
                    typeof event.delta === "string"
                ) {
                    sawReasoning = true;
                    callbacks.onReasoningDelta?.(event.delta);
                }

                if (
                    event.type === "response.output_text.delta" &&
                    typeof event.delta === "string"
                ) {
                    if (hasTools) {
                        pendingText += event.delta;
                    } else {
                        fullText += event.delta;
                        callbacks.onContentDelta?.(event.delta);
                    }
                }

                if (
                    event.type === "response.output_item.added" &&
                    event.item?.type === "function_call"
                ) {
                    const call = parseFunctionCall(event.item);
                    startedToolCallIds.add(call.id);
                    callbacks.onToolCallStart?.(call);
                }

                if (
                    event.type === "response.output_item.done" &&
                    event.item?.type === "function_call"
                ) {
                    const call = parseFunctionCall(event.item);
                    if (!startedToolCallIds.has(call.id)) {
                        callbacks.onToolCallStart?.(call);
                    }
                    toolCalls.push(call);
                }
            }
        }

        if (sawReasoning) callbacks.onReasoningBlockEnd?.();

        if (!toolCalls.length || !runTools) {
            if (pendingText) {
                fullText += pendingText;
                callbacks.onContentDelta?.(pendingText);
            }
            break;
        }

        const results = await runTools(toolCalls);
        input = results.map((result) => ({
            type: "function_call_output",
            call_id: result.tool_use_id,
            output: result.content,
        }));
    }

    return { fullText };
}

export async function completeOpenAIText(params: {
    model: string;
    systemPrompt?: string;
    user: string;
    maxTokens?: number;
    apiKeys?: { openai?: string | null };
}): Promise<string> {
    if (endpointMode() === "chat.completions") {
        const response = await createChatCompletion({
            model: params.model,
            messages: toChatCompletionMessages(params.systemPrompt ?? "", [
                { role: "user", content: params.user },
            ]),
            maxTokens: params.maxTokens ?? 512,
            apiKey: apiKey(params.apiKeys?.openai),
        });
        const json = (await response.json()) as {
            choices?: {
                message?: {
                    content?:
                        | string
                        | {
                              type?: string;
                              text?: string;
                          }[];
                };
            }[];
        };

        const content = json.choices?.[0]?.message?.content;
        if (typeof content === "string") return content;
        return (
            content
                ?.filter((part) => part.type === "text")
                .map((part) => part.text ?? "")
                .join("") ?? ""
        );
    }

    const response = await createResponse({
        model: params.model,
        instructions: params.systemPrompt,
        input: [{ role: "user", content: params.user }],
        maxTokens: params.maxTokens ?? 512,
        apiKey: apiKey(params.apiKeys?.openai),
    });
    const json = (await response.json()) as {
        output_text?: string;
        output?: {
            content?: { type?: string; text?: string }[];
        }[];
    };

    if (typeof json.output_text === "string") return json.output_text;

    return (
        json.output
            ?.flatMap((item) => item.content ?? [])
            .filter((content) => content.type === "output_text")
            .map((content) => content.text ?? "")
            .join("") ?? ""
    );
}

export type { NormalizedToolResult };
