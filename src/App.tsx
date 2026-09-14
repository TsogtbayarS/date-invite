import { useEffect, useMemo, useState } from 'react'
import { ChoiceButton } from './components/ChoiceButton'
import { Progress } from './components/Progress'
import { activities, cuisines } from './data/options'
import { submitAnswer } from './services/submitAnswer'
import type { DateFlowState, Step } from './types/dateFlow'


const initialState: DateFlowState = {
  step: 'intro',
  answer: null,
  activity: null,
  cuisine: null,
  sushiChoice: null,
}

const stepProgress: Partial<Record<Step, number>> = {
  intro: 1,
  context: 1,
  question: 2,
  'yes-loading': 3,
  activity: 3,
  cuisine: 4,
  'sushi-joke': 4,
  'sushi-decision': 4,
  result: 5,
  maybe: 5,
  decline: 5,
}

function App() {
  const [flow, setFlow] = useState<DateFlowState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const go = (step: Step) => setFlow((current) => ({ ...current, step }))

  useEffect(() => {
    if (flow.step !== 'yes-loading') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => go('activity'), reduceMotion ? 250 : 3000)
    return () => window.clearTimeout(timer)
  }, [flow.step])

  const resultTitle = useMemo(() => {
    if (flow.activity === 'coffee') return 'Coffee it is ☕'
    if (flow.activity === 'fun') return 'Something fun it is 🎳'
    if (flow.activity === 'surprise') return "That's a dangerous amount of trust 😂"
    if (flow.activity === 'dinner' && flow.cuisine === 'sushi' && flow.sushiChoice === 'sushi-guy-picks') {
      return 'Challenge accepted 😌🍣'
    }
    if (flow.activity === 'dinner' && flow.cuisine === 'sushi') return 'Sushi it is 🍣'
    if (flow.activity === 'dinner' && flow.cuisine) {
      const selected = cuisines.find((item) => item.id === flow.cuisine)
      return `Dinner + ${selected?.label ?? 'your pick'} ${selected?.emoji ?? ''}`
    }
    return 'Sounds good :)'
  }, [flow]
  )
  const handleSendAnswer = async () => {
    if (isSubmitting || submitSuccess) {
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')

      const response = await submitAnswer(
        flow,
        resultTitle
      )

      console.log('Response submitted:', response)

      setSubmitSuccess(true)
    } catch (error) {
      console.error('Submission failed:', error)

      setSubmitError(
        'Something went wrong. Please try again 🙂'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMaybe = async () => {
    if (isSubmitting || submitSuccess) {
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')

      const response = await submitAnswer(
        flow,
        'Maybe — let’s talk first'
      )

      console.log('Maybe response submitted:', response)

      setSubmitSuccess(true)
    } catch (error) {
      console.error('Submission failed:', error)

      setSubmitError(
        'Something went wrong. Please try again 🙂'
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <main className="page-shell">
      <section className="invite-card" aria-live="polite">
        <Progress current={stepProgress[flow.step] ?? 1} />

        {flow.step === 'intro' && (
          <div className="step">
            <div className="hero-icon">♡</div>
            <p className="eyebrow">A little something</p>
            <h1>Hey :)</h1>
            <p>This is probably a slightly unusual way to say hi, but I thought I’d make something small instead.</p>
            <ChoiceButton primary onClick={() => go('context')}>Continue →</ChoiceButton>
            <p className="signature">— the sushi guy 🍣</p>
          </div>
        )}

        {flow.step === 'context' && (
          <div className="step">
            <p className="eyebrow">Nothing scary, promise</p>
            <h1>We’ve only really exchanged a few good mornings so far…</h1>
            <p>But you seem cool, and I thought I’d take a chance and ask you something.</p>
            <ChoiceButton primary onClick={() => go('question')}>Okay, I’m listening 👀</ChoiceButton>
            <ChoiceButton subtle onClick={() => go('intro')}>← Back</ChoiceButton>
          </div>
        )}

        {flow.step === 'question' && (
          <div className="step">
            <div className="hero-icon">♡</div>
            <p className="eyebrow">The question</p>
            <h1>Would you be interested in grabbing coffee or doing something sometime?</h1>
            <p>Totally okay if not — I just thought it would be nice to get to know you.</p>
            <ChoiceButton primary onClick={() => setFlow((s) => ({ ...s, answer: 'yes', step: 'yes-loading' }))}>Yeah :)</ChoiceButton><ChoiceButton
              onClick={() => {
                setFlow((prev) => ({
                  ...prev,
                  answer: 'maybe',
                  step: 'maybe',
                }))
              }}
            >
              Maybe — let's talk first
            </ChoiceButton>
            <ChoiceButton onClick={() => setFlow((s) => ({ ...s, answer: 'no', step: 'decline' }))}>No, but thank you</ChoiceButton>
            <ChoiceButton subtle onClick={() => go('context')}>← Back</ChoiceButton>
          </div>
        )}

        {flow.step === 'yes-loading' && (
          <div className="step loading-step">
            <div className="loader">🍣</div>
            <p className="eyebrow">Processing response…</p>
            <h1>Checking courage…</h1>
            <div className="status-list">
              <span>✓ Well then... 😄</span>
              <span>✓ Sushi guy still functioning</span>
              <span>✓ Enough courage found 😄</span>
            </div>
          </div>
        )}

        {flow.step === 'activity' && (
          <div className="step">
            <p className="eyebrow">Nice 😄</p>
            <h1>What sounds good to you?</h1>
            <p>Pick whatever you’d actually enjoy.</p>
            <div className="option-grid">
              {activities.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="option-card"
                  onClick={() => {
                    if (item.id === 'dinner') {
                      setFlow((s) => ({ ...s, activity: item.id, cuisine: null, sushiChoice: null, step: 'cuisine' }))
                    } else {
                      setFlow((s) => ({ ...s, activity: item.id, cuisine: null, sushiChoice: null, step: 'result' }))
                    }
                  }}
                >
                  <span className="option-emoji">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <ChoiceButton subtle onClick={() => go('question')}>← Back</ChoiceButton>
          </div>
        )}

        {flow.step === 'cuisine' && (
          <div className="step">
            <p className="eyebrow">Dinner it is 🍽️</p>
            <h1>What kind of food do you like?</h1>
            <p>Pick whatever sounds best.</p>
            <div className="option-grid cuisine-grid">
              {cuisines.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="option-card"
                  onClick={() => {
                    if (item.id === 'sushi') {
                      setFlow((s) => ({ ...s, cuisine: item.id, step: 'sushi-joke' }))
                    } else {
                      setFlow((s) => ({ ...s, cuisine: item.id, step: 'result' }))
                    }
                  }}
                >
                  <span className="option-emoji">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <ChoiceButton subtle onClick={() => go('activity')}>← Back</ChoiceButton>
          </div>
        )}

        {flow.step === 'sushi-joke' && (
          <div className="step">
            <div className="hero-icon">🍣</div>
            <p className="eyebrow">Wait a second…</p>
            <h1>Sushi with the sushi guy?</h1>
            <p>That’s either a great idea or a very questionable decision. 😂</p>
            <div className="joke-card">I spend all day making sushi and somehow sushi still made the shortlist. I respect it.</div>
            <ChoiceButton primary onClick={() => go('sushi-decision')}>I’m willing to risk it 🍣</ChoiceButton>
            <ChoiceButton onClick={() => setFlow((s) => ({ ...s, cuisine: null, step: 'cuisine' }))}>Okay okay, show me something else 😂</ChoiceButton>
          </div>
        )}

        {flow.step === 'sushi-decision' && (
          <div className="step">
            <div className="hero-icon">😌🍣</div>
            <p className="eyebrow">Bold choice</p>
            <h1>I respect it. 😂</h1>
            <p>Now the important question…</p>
            <ChoiceButton primary onClick={() => setFlow((s) => ({ ...s, sushiChoice: 'she-picks', step: 'result' }))}>You choose the sushi place</ChoiceButton>
            <ChoiceButton onClick={() => setFlow((s) => ({ ...s, sushiChoice: 'sushi-guy-picks', step: 'result' }))}>Let the sushi guy choose 😌</ChoiceButton>
            <ChoiceButton subtle onClick={() => go('cuisine')}>← Maybe not sushi</ChoiceButton>
          </div>
        )}

        {flow.step === 'result' && (
          <div className="step">
            <div className="hero-icon">♡</div>
            <p className="eyebrow">Sounds good</p>
            <h1>{resultTitle}</h1>
            {flow.activity === 'dinner' && flow.cuisine === 'sushi' && flow.sushiChoice === 'sushi-guy-picks' && (
              <div className="joke-card">No Kroger sushi for the first date. Promise. 😂</div>
            )}
            {flow.activity === 'surprise' && <p>I’ll come up with something simple and fun. I’ll try not to overthink it.</p>}
            {flow.activity !== 'surprise' && <p>We’ll figure out the rest whenever you’re comfortable.</p>}
            {!submitSuccess ? (
              <>
                <div className="result-note">
                  <strong>Looks good?</strong>

                  <span>
                    Nothing gets sent until you press
                    the button below.
                  </span>
                </div>

                <ChoiceButton
                  primary
                  onClick={handleSendAnswer}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Sending...'
                    : 'Send my answer 💌'}
                </ChoiceButton>

                {submitError && (
                  <p className="submit-error">
                    {submitError}
                  </p>
                )}

                <ChoiceButton
                  subtle
                  onClick={() => go('activity')}
                  disabled={isSubmitting}
                >
                  ← Change choice
                </ChoiceButton>
              </>
            ) : (
              <div className="sent-state">
                <div className="hero-icon">💌</div>

                <h1>Sent!</h1>

                <p>
                  The sushi guy officially has the message. 😄
                </p>

                <p className="signature">
                  Now I’ll stop making this website do things.
                </p>
              </div>
            )}
          </div>
        )}

        {flow.step === 'maybe' && (
          <div className="step">
            <div className="hero-icon">☺</div>

            <p className="eyebrow">
              Fair enough
            </p>

            {!submitSuccess ? (
              <>
                <h1>We can just talk first.</h1>

                <p>
                  No need to decide anything.
                  I’d still be happy to get to know you.
                </p>

                <div className="result-note">
                  <strong>Want to send me that answer?</strong>

                  <span>
                    Nothing gets sent until you press
                    the button below.
                  </span>
                </div>

                <ChoiceButton
                  primary
                  onClick={handleSendMaybe}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Sending...'
                    : 'Send this answer 💌'}
                </ChoiceButton>

                {submitError && (
                  <p className="submit-error">
                    {submitError}
                  </p>
                )}

                <ChoiceButton
                  subtle
                  onClick={() => go('question')}
                  disabled={isSubmitting}
                >
                  ← Back
                </ChoiceButton>
              </>
            ) : (
              <div className="sent-state">
                <div className="hero-icon">💌</div>

                <h1>Got it :)</h1>

                <p>
                  We can just talk first.
                  No pressure.
                </p>

                <p className="signature">
                  — the sushi guy 🍣
                </p>
              </div>
            )}
          </div>
        )}

        {flow.step === 'decline' && (
          <div className="step">
            <div className="hero-icon">♡</div>

            <h1>No worries :)</h1>

            <p>
              Thanks for checking this out.
            </p>

            <ChoiceButton
              subtle
              onClick={() => go('question')}
            >
              ← I tapped that by mistake
            </ChoiceButton>
          </div>
        )}

        <footer className="dev-footer">
          <span>build: first-date-v0.1</span>
          <span>status: hoping for a yes</span>
        </footer>
      </section>
    </main>
  )
}

export default App
