<script setup lang="ts">
import { ElementData } from '@vue-flow/core'

const props = defineProps<{
  block: ElementData
}>()

const colors = {
  questionnaire: 'bg-red-100',
  rule: 'bg-blue-100',
  basic_page: 'bg-green-100'
}
</script>

<template>
  <div
    class="relative z-[999] shadow rounded-lg border border-gray-300 p-4 select-none cursor-grab"
    :class="colors[props.block.type as keyof typeof colors]"
  >
    <p class="font-semibold select-none">name: {{ props.block.name }}</p>
    <p class="text-gray-600 select-none">type: {{ props.block.type }}</p>
  </div>
</template>
