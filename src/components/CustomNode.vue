<script setup lang="ts">
import { ElementData, Handle, Position } from '@vue-flow/core'
import { isEmptyObject } from 'tsu'

const props = defineProps<{
  data: ElementData
}>()

const colors = {
  questionnaire: 'bg-red-100',
  rule: 'bg-blue-100',
  basic_page: 'bg-green-100'
}
</script>

<template>
  <div
    class="shadow rounded-lg border border-gray-300 p-8"
    :class="colors[props.data.type as keyof typeof colors]"
  >
    <p class="font-semibold">name: {{ props.data.name }}</p>
    <p class="text-gray-600">type: {{ props.data.type }}</p>

    <Handle id="custom-a" :position="Position.Top" class="w-2 h-2 bg-black rounded-full" />
    <Handle id="custom-b" :position="Position.Bottom" class="w-2 h-2 bg-black rounded-full" />
  </div>
</template>
