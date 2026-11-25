# dsh-compaction-agentframe

AgentFrame compaction backend plugin — replaces DeepSeek Harness's default
LLM-summarization compaction with **semantic + physical dual-track compression**
(the 28.4x KV-compression idea).

## Why replace the default compaction

The default `compaction-basic` uses LLM summarization (a lossy recap of old
conversation), spending one LLM call per compaction, and the summary may lose
detail.

The AgentFrame approach:
- **Semantic track**: MemoryDirector decides which tokens are worth keeping (drop chatter, keep the essentials).
- **Physical track**: absorptive MLA + INT4 quantization (270KB→7.6KB/token, 28.4x).
- **Result**: key information retained + large token savings + no extra LLM calls.

## Usage

In your profile's `cordis.patch.yml`, replace `compaction-basic` with:

```yaml
- id: compaction-agentframe
  name: '@deepseek-ai/dsh-compaction-agentframe'
  config:
    semantic: true
    retainRatio: 0.2
    physical: true
```

## Configuration

| Field | Default | Description |
|-------|---------|-------------|
| `semantic` | true | Semantic compression (keep high-information lines) |
| `retainRatio` | 0.2 | Retention ratio after compaction |
| `physical` | true | Physical compression accounting (bytes/token) |
| `bytesPerToken` | 7776 | Bytes per token after INT4 compression |
| `auto` | true | Automatic compaction |

## Implementation

Extends `CompactionEngine` (the compaction seam) and implements its three abstract methods:
- `compactIfNeeded` — automatic pressure trigger
- `compactNow` — manual /compact command
- `compactRegion` — compaction of a specified range

Keeps dsh's surface/event/persistence contract (compaction/start → replace → compaction/end);
only replaces *how* compaction is done.

## License

GPL-3.0 © Cloud LTE Studio / AgentFrame
