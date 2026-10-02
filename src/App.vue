<script setup lang="ts">
import { computed, ref } from 'vue'

type ReviewMode = 'quick' | 'thorough' | 'security' | 'performance'
type ReviewIssue = { type: string; location: string; problem: string; fix: string; priority: 'high' | 'medium' | 'low' }
type ReviewResult = { filename: string; language: string; mode: ReviewMode; summary: string; issues: ReviewIssue[]; timestamp: string }

const sampleCode = `function processUserData(userData) {
  // Bug: no null check
  const email = userData.email.toLowerCase();

  // Performance issue: inefficient search
  const users = getAllUsers();
  for (let i = 0; i <= users.length; i++) {
    if (users[i].email === email) {
      return users[i];
    }
  }

  // Security issue: no input validation
  const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
  return database.query(query);
}`

const modes: { id: ReviewMode; label: string; description: string }[] = [
  { id: 'quick', label: 'Quick', description: 'Bugs and obvious issues' },
  { id: 'thorough', label: 'Thorough', description: 'Architecture and quality' },
  { id: 'security', label: 'Security', description: 'Vulnerabilities and validation' },
  { id: 'performance', label: 'Performance', description: 'Efficiency and resource use' },
]

const filename = ref('sample.js')
const code = ref(sampleCode)
const mode = ref<ReviewMode>('quick')
const result = ref<ReviewResult | null>(null)
const status = ref<'idle' | 'reviewing' | 'complete' | 'error'>('idle')
const errorMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const issueCount = computed(() => result.value?.issues.length ?? 0)

const loadExample = () => {
  filename.value = 'sample.js'
  code.value = sampleCode
  result.value = null
  status.value = 'idle'
  errorMessage.value = ''
}

const handleFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  filename.value = file.name
  const reader = new FileReader()
  reader.onload = () => {
    code.value = String(reader.result ?? '')
    result.value = null
    status.value = 'idle'
    errorMessage.value = ''
  }
  reader.readAsText(file)
}

const review = async () => {
  if (!filename.value.trim() || !code.value.trim()) {
    errorMessage.value = 'Add a filename and source code before reviewing.'
    status.value = 'error'
    return
  }

  status.value = 'reviewing'
  errorMessage.value = ''
  try {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: filename.value, code: code.value, mode: mode.value }),
    })
    const payload = await response.json()
    if (!response.ok) throw new Error(payload.error ?? 'The review could not be completed.')
    result.value = payload as ReviewResult
    status.value = 'complete'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'The review could not be completed.'
    status.value = 'error'
  }
}
</script>

<template>
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Orbit home"><span class="brand-mark">✦</span><span>orbit</span></a>
      <div class="stack-badge"><span class="status-dot" /> AI code reviewer</div>
    </header>

    <section class="hero">
      <p class="eyebrow">Strategic review workflows</p>
      <h1>Find the flaw<br /><em>before production.</em></h1>
      <p class="intro">Give Orbit a file and a focus. Get specific, actionable feedback powered by the AI SDK.</p>
    </section>

    <section class="workspace" aria-label="Code review workspace">
      <div class="workspace-header">
        <div><span class="label">CODE INPUT</span><h2>Review a file</h2></div>
        <button class="text-button" type="button" @click="loadExample">Load example</button>
      </div>

      <div class="file-row">
        <label class="filename-field">Filename<input v-model="filename" placeholder="example.ts" /></label>
        <input ref="fileInput" class="visually-hidden" type="file" accept=".js,.ts,.jsx,.tsx,.vue,.py,.go,.rs,.java" @change="handleFile" />
        <button class="upload-button" type="button" @click="fileInput?.click()">Choose file</button>
      </div>
      <textarea v-model="code" class="code-editor" spellcheck="false" aria-label="Source code" />

      <div class="review-controls">
        <div class="mode-list" role="radiogroup" aria-label="Review mode">
          <button v-for="item in modes" :key="item.id" class="mode-option" :class="{ active: mode === item.id }" type="button" role="radio" :aria-checked="mode === item.id" @click="mode = item.id">
            <span class="mode-name">{{ item.label }}</span><span>{{ item.description }}</span>
          </button>
        </div>
        <button class="review-button" type="button" :disabled="status === 'reviewing'" @click="review">
          {{ status === 'reviewing' ? 'Reviewing…' : 'Review code ↗' }}
        </button>
      </div>
    </section>

    <section v-if="status === 'error'" class="notice error" role="alert">{{ errorMessage }}</section>
    <section v-if="result" class="results" aria-live="polite">
      <div class="results-header"><div><span class="label">REVIEW RESULT</span><h2>{{ result.filename }} <span class="language">{{ result.language }}</span></h2></div><span class="issue-count">{{ issueCount }} {{ issueCount === 1 ? 'issue' : 'issues' }}</span></div>
      <p class="summary">{{ result.summary }}</p>
      <div v-if="result.issues.length" class="issue-list">
        <article v-for="(issue, index) in result.issues" :key="`${issue.location}-${index}`" class="issue" :class="issue.priority">
          <div class="issue-top"><span class="priority">{{ issue.priority }}</span><span class="issue-type">{{ issue.type }}</span><span class="issue-location">{{ issue.location }}</span></div>
          <h3>{{ issue.problem }}</h3><p>{{ issue.fix }}</p>
        </article>
      </div>
    </section>

    <footer><span>Built with intention</span><a href="https://ai-sdk.dev" target="_blank">ai-sdk.dev ↗</a></footer>
  </main>
</template>
