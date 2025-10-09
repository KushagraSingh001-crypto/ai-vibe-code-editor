import { type NextRequest, NextResponse } from "next/server";

// Interface for the incoming chat request from the frontend
interface ChatRequest {
    message: string;
    history: { role: "user" | "assistant"; content: string }[];
    stream?: boolean;
    mode?: string; // e.g., "chat", "review", "fix"
}

// A simplified function to call the AI service for a chat response
async function generateChatResponse(prompt: string): Promise<string> {
    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "codellama:7b", // Or any other model you prefer
                prompt,
                stream: false, // Streaming requires a different handler logic
                options: {
                    temperature: 0.7,
                    num_predict: 500, // Max tokens for a chat response
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`AI service error: ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        return data.response.trim();

    } catch (error) {
        console.error("AI chat generation error:", error);
        throw new Error("Failed to generate AI response.");
    }
}


export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();
        const { message, history, mode } = body;

        // 1. Validate the incoming request
        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // 2. Build a prompt for the AI model
        // We can create a more sophisticated prompt based on history and mode
        const prompt = `
            You are a helpful AI assistant.
            Previous conversation:
            ${history.map(h => `${h.role}: ${h.content}`).join('\n')}

            Current user message: ${message}
            Assistant:
        `;


        // 3. Call the AI service to get a response
        const aiResponse = await generateChatResponse(prompt);

        // 4. Send the successful response back to the frontend
        return NextResponse.json({
            response: aiResponse,
            tokens: Math.round(aiResponse.length / 4), // Simple token estimation
            model: "codellama:7b",
        });

    } catch (error: any) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        );
    }
}