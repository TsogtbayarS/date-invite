import type { DateFlowState } from '../types/dateFlow'

export interface DateResponseResult {
    id: string
    submittedAt: string
    message: string
}

export async function submitAnswer(
    flow: DateFlowState,
    summary: string
): Promise<DateResponseResult> {
    const apiUrl = import.meta.env.VITE_API_URL

    if (!apiUrl) {
        throw new Error('VITE_API_URL is not configured')
    }

    const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/api/responses`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                answer: flow.answer,
                activity: flow.activity,
                cuisine: flow.cuisine,
                sushiChoice: flow.sushiChoice,
                summary,
            }),
        }
    )

    if (!response.ok) {
        throw new Error(
            `Request failed with status ${response.status}`
        )
    }

    return response.json()
}