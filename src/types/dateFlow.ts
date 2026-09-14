export type Answer = 'yes' | 'maybe' | 'no' | null
export type Activity = 'coffee' | 'dinner' | 'fun' | 'surprise' | null
export type Cuisine =
  | 'italian'
  | 'mexican'
  | 'sushi'
  | 'american'
  | 'steak'
  | 'light'
  | 'anything'
  | null
export type SushiChoice = 'she-picks' | 'sushi-guy-picks' | null

export type Step =
  | 'intro'
  | 'context'
  | 'question'
  | 'yes-loading'
  | 'activity'
  | 'cuisine'
  | 'sushi-joke'
  | 'sushi-decision'
  | 'result'
  | 'maybe'
  | 'decline'

export interface DateFlowState {
  step: Step
  answer: Answer
  activity: Activity
  cuisine: Cuisine
  sushiChoice: SushiChoice
}
