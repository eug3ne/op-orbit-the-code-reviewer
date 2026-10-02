<script setup lang="ts">
import { ref } from 'vue'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/vue'

const input = ref('')
const { messages, sendMessage, status, error, stop } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
})

const submit = () => {
  const text = input.value.trim()
  if (!text || status.value !== 'ready') return
  sendMessage({ text })
  input.value = ''
}

const textParts = (message: (typeof messages.value)[number]) =>
  message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
</script>

<template>
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Orbit home">
        <span class="brand-mark">✦</span>
        <span>orbit</span>
      </a>
      <div class="stack-badge"><span class="status-dot" /> AI SDK · Vue</div>
    </header>

    <section class="hero">
      <p class="eyebrow">A focused starting point</p>
      <h1>Ideas in.<br /><em>Momentum out.</em></h1>
      <p class="intro">A small, sharp Vue playground for building with streaming AI.</p>
    </section>

    <section class="chat-card" aria-label="Chat with Orbit">
      <div class="card-heading">
        <div>
          <span class="label">CONVERSATION</span>
          <h2>Talk it through</h2>
        </div>
        <span class="sparkle">✧</span>
      </div>

      <div class="messages" aria-live="polite">
        <div v-if="messages.length === 0" class="empty-state">
          <span class="empty-icon">◎</span>
          <p>Ask for a thought, a plan, or a new perspective.</p>
        </div>
        <article v-for="message in messages" :key="message.id" class="message" :class="message.role">
          <div class="message-meta">{{ message.role === 'user' ? 'YOU' : 'ORBIT' }}</div>
          <p>{{ textParts(message) }}</p>
        </article>
        <div v-if="status === 'submitted'" class="thinking"><span /> <span /> <span /></div>
      </div>

      <div v-if="error" class="error">Something went wrong. Check your API key and try again.</div>
      <form class="composer" @submit.prevent="submit">
        <input v-model="input" :disabled="status !== 'ready'" placeholder="What are you thinking about?" aria-label="Message" />
        <button v-if="status === 'streaming'" type="button" class="stop" @click="stop">Stop</button>
        <button v-else type="submit" :disabled="!input.trim() || status !== 'ready'" aria-label="Send message">↗</button>
      </form>
    </section>

    <footer><span>Built with intention</span><a href="https://ai-sdk.dev" target="_blank">ai-sdk.dev ↗</a></footer>
  </main>
</template>
