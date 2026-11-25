/**
 * Smoke test: load AgentFrameCompactionEngine in a Cordis context.
 */
import { Context } from '@deepseek-ai/cordis'
import { AgentFrameCompactionEngine } from '../src/index.js'

async function main() {
  const ctx = new Context()

  // Register the AgentFrame compaction engine.
  const engine = new AgentFrameCompactionEngine(ctx, {
    semantic: true,
    retainRatio: 0.2,
    physical: true,
    bytesPerToken: 7776,
    auto: false,
  })

  // Verify it's exposed on ctx.compaction.
  const registered = ctx.get('compaction')
  console.log('[smoke] ctx.compaction =', registered ? '✅ registered' : '❌ missing')

  // Verify class identity.
  console.log('[smoke] engine instanceof AgentFrameCompactionEngine =',
    engine instanceof AgentFrameCompactionEngine ? '✅' : '❌')

  // Verify config.
  console.log('[smoke] config =', JSON.stringify(engine.config))

  // Verify abstract methods are implemented.
  const methods = ['compactIfNeeded', 'compactNow', 'compactRegion']
  for (const m of methods) {
    console.log(`[smoke] ${m} =`, typeof (engine as any)[m] === 'function' ? '✅' : '❌')
  }

  // Verify condense logic with a fake session.
  const fakeSession = {
    log: [
      { seq: 0, type: 'user/message', content: 'Write me a TCP server' },
      { seq: 1, type: 'assistant/message', content: 'Sure, using Python\'s socket module. First create the socket: `s = socket.socket()`' },
      { seq: 2, type: 'user/message', content: 'Nice weather today' },
      { seq: 3, type: 'assistant/message', content: 'Haha yes. Continuing: bind port 8080, listen for connections.' },
      { seq: 4, type: 'user/message', content: 'How should I handle errors?' },
      { seq: 5, type: 'assistant/message', content: 'Catch ConnectionError with try/except and log it. That is the key point.' },
      { seq: 6, type: 'user/message', content: 'OK, got it' },
      { seq: 7, type: 'assistant/message', content: 'Sure, ask anytime.' },
    ],
  }

  const span = (engine as any)._selectSpan(fakeSession)
  console.log('\n[smoke] selected span =', span)

  const summary = (engine as any)._condense(fakeSession, span.start, span.end)
  console.log('[smoke] condensed summary:')
  console.log('----------------------------------------')
  console.log(summary)
  console.log('----------------------------------------')

  // Verify chatter was dropped (no "Nice weather" in summary).
  const chatterDropped = !summary.includes('Nice weather')
  const codeKept = summary.includes('socket')
  console.log('[smoke] chatter dropped =', chatterDropped ? '✅' : '❌')
  console.log('[smoke] key code kept =', codeKept ? '✅' : '❌')

  console.log('\n✅ smoke test complete')
}

main().catch((e) => {
  console.error('❌ smoke test failed:', e)
  process.exit(1)
})
