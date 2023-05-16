<script setup lang="ts">
import { Element, FlowProps, VueFlow, useVueFlow } from '@vue-flow/core'
import { onClickOutside } from '@vueuse/core'
import { DraggableState, useDraggable } from '@braks/revue-draggable'
import { Obj } from 'tsu'

const { addEdges, onConnect, toObject, onConnectEnd, getEdges, getNodes } = useVueFlow()

onConnect((params) => {
  const sourceID = params.source
  const targetID = params.target

  // can only have 1 child unless filter
  const source = getNodes.value.find((node) => node.id === sourceID)!
  const target = getNodes.value.find((node) => node.id === targetID)!

  const edgesWithSourceAsOrigin = getEdges.value.filter((edge) => edge.source === sourceID)

  if (source.data.type === 'rule' || edgesWithSourceAsOrigin.length === 0) {
    addEdges(params)
  }
})

const latestID = ref(4)

const elements = ref<Element[]>([
  {
    id: '1',
    type: 'custom',
    label: 'Node 1',
    position: { x: 50, y: 50 },
    data: { type: 'basic_page', name: 'Basic Page #1' }
  },
  {
    id: '2',
    type: 'custom',
    label: 'Node 2',
    position: { x: 50, y: 300 },
    data: { type: 'basic_page', name: 'Basic Page #2' }
  },
  {
    id: '3',
    type: 'custom',
    label: 'Node 3',
    position: { x: 50, y: 550 },
    data: { type: 'basic_page', name: 'Basic Page #3' }
  },
  {
    id: '4',
    type: 'custom',
    label: 'Node 4',
    position: { x: 500, y: 300 },
    data: { type: 'questionnaire', name: 'Questionnaire #1' },
    isValidTargetPos: (connection) => {
      console.log('hihihih')
      return false
    }
  },
  { id: 'e1-2', source: '1', target: '2', sourceHandle: 'custom-b', targetHandle: 'custom-a' },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: 'custom-b', targetHandle: 'custom-a' }
])

const config: FlowProps = {
  zoomOnDoubleClick: false,
  zoomOnPinch: false,
  zoomOnScroll: false

  // snapToGrid: true,
  // snapGrid: [50, 50]
}

function log() {
  const o = toObject()
  console.log(o)

  isShowingCtxMenu.value = false
}

function createItem(data: Obj<any> = {}) {
  const newItem = {
    id: String(++latestID.value),
    type: 'custom',
    label: 'New Item',
    position: {
      x: ctxMenuPosition.x - 20,
      y: ctxMenuPosition.y - 40
    },
    data
  }

  elements.value.push(newItem)

  isShowingCtxMenu.value = false
}

const ctxMenu = ref<HTMLElement>()
const ctxMenuPosition = reactive({ x: 0, y: 0 })
const isShowingCtxMenu = ref(false)

function showCtxMenu(e: MouseEvent) {
  const el = e.target as HTMLElement
  const rect = el.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  ctxMenuPosition.x = Number(x.toFixed(2)) + 28
  ctxMenuPosition.y = Number(y.toFixed(2)) + 28

  console.log(`Showing at pos: (${ctxMenuPosition.x}, ${ctxMenuPosition.y})`)

  isShowingCtxMenu.value = true
}

onClickOutside(ctxMenu, () => {
  isShowingCtxMenu.value = false
})

const blocks = [
  { type: 'questionnaire', name: 'Questionnaire' },
  { type: 'rule', name: 'Filter/Rule' },
  { type: 'basic_page', name: 'Basic Page' }
]

const selectedBlock = ref<(typeof blocks)[number] | null>(null)

function createItem2(x: number, y: number, data: Obj<any> = {}) {
  const newItem = {
    id: String(++latestID.value),
    type: 'custom',
    label: 'New Item',
    position: { x, y },
    data
  }

  elements.value.push(newItem)

  isShowingCtxMenu.value = false
}

const flowchartRef = ref()

function handleDragStart(e: MouseEvent, block: (typeof blocks)[number]) {
  selectedBlock.value = block
}

function handleMouseUp(e: MouseEvent, state: DraggableState) {
  // the mouseup event could happen on the root element, or its children
  // we need to ensure that we select the parent element, to undo the
  // styles that @braks/revue-draggable sets
  let el = e.target as HTMLElement

  while (el && !el.classList.contains('revue-draggable')) {
    el = el.parentElement!
  }

  // check if mouseup event intersects the flowchart
  const rect = flowchartRef.value.$el.getBoundingClientRect()
  const validX = e.clientX >= rect.left && e.clientX <= rect.right
  const validY = e.clientY >= rect.top && e.clientY <= rect.bottom
  const isIntersecting = validX && validY

  if (isIntersecting) {
    const x = e.clientX - rect.left - 8
    const y = e.clientY - rect.top - 8
    createItem2(x, y, { ...selectedBlock.value })
  }

  // reset element's position
  state.currentPosition.x = 0
  state.currentPosition.y = 0

  // apply visuals
  el.style.transform = 'translate(0px)'

  // release selected block
  selectedBlock.value = null
}

function handleMousedown() {
  console.log('?')
}
</script>

<template>
  <div class="fixed inset-0">
    <div class="flex h-full">
      <!-- panel -->
      <aside class="relative z-10 border-r border-gray-200 p-8 w-[380px] h-full">
        <button class="bg-indigo-500 text-white" @click="log">Log</button>

        <div class="relative mt-8 space-y-4">
          <Draggable
            v-for="block in blocks"
            :key="block.name"
            @start="handleDragStart($event, block)"
          >
            <template #default="{ state }">
              <DragItem :block="block" @mouseup="handleMouseUp($event, state)" />
            </template>
          </Draggable>
        </div>
      </aside>

      <!-- chart -->
      <div class="relative w-full bg-gray-100 p-8">
        <VueFlow
          ref="flowchartRef"
          v-bind="config"
          v-model="elements"
          class="z-0 border bg-gradient-to-tr from-cyan-50 to-pink-50 w-full h-full"
          @contextmenu.prevent="showCtxMenu"
        >
          <template #node-custom="{ data }">
            <CustomNode :data="data" />
          </template>
        </VueFlow>

        <ul
          v-if="isShowingCtxMenu"
          ref="ctxMenu"
          class="absolute z-50 bg-white p-4 rounded-lg shadow-md"
          role="menu"
          :style="{ top: `${ctxMenuPosition.y}px`, left: `${ctxMenuPosition.x}px` }"
        >
          <li role="menuitem" @click="createItem">(+) create item</li>

          <li role="menuitem" @click="log">(&lt; &sol;&gt;) log</li>
        </ul>
      </div>
    </div>
  </div>
</template>
