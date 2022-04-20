<template>
  <div ref="graphRef" class="d3-component" />
</template>

<script lang="ts">
import * as d3 from 'd3'

import { onMounted, defineComponent, ref, Ref } from 'vue'

export default defineComponent({
  name: 'EmissionGraph',
  props: {
    gradient: {
      required: true,
      type: Array
    },
    maxPoint: {
      required: true,
      type: Number
    },
    csv: {
      required: true,
      type: String
    },
    svgWidth: {
      required: true,
      type: String
    },
    svgHeight: {
      required: true,
      type: String
    }
  },
  setup(props) {
    const graphRef = ref(null) as unknown as Ref<HTMLElement>

    const mountGraph = () => {
      if (props.csv && graphRef.value) {
        if (graphRef.value != null) {
          graphRef.value.innerHTML = ''
        }

        const margin = { top: 10, right: 30, bottom: 30, left: 60 }
        const width = Number(props.svgWidth) - margin.left - margin.right
        const height = Number(props.svgHeight) - margin.top - margin.bottom

        const svg = d3
          .select(graphRef.value)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`)

        d3.csv(
          props.csv,

          (d: { date: unknown; value: unknown }) => {
            return {
              date: d3.timeParse('%Y-%m-%d')(d.date as string),
              value: d.value
            }
          }
        ).then(function (data: unknown) {
          const x = d3
            .scaleTime()
            .domain(d3.extent(data as never, (d: { date: string }) => d.date) as unknown as [Date, number])
            .range([0, width])
          const xAxis = svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

          const y = d3
            .scaleLinear()
            .domain([0, d3.max(data as never, (d: { value: number }) => +d.value)] as unknown as [number, number])
            .range([height, 0])
          svg.append('g').call(d3.axisLeft(y))

          svg
            .append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('x', 0)
            .attr('y', 0)

          svg
            .append('linearGradient')
            .attr('id', 'area-gradient')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', y(0))
            .attr('x2', 0)
            .attr('y2', y(props.maxPoint))
            .selectAll('stop')
            .data([
              { offset: '0%', color: props.gradient[0] },
              { offset: '30%', color: props.gradient[1] },
              { offset: '45%', color: props.gradient[2] },
              { offset: '55%', color: props.gradient[3] },
              { offset: '75%', color: props.gradient[4] },
              { offset: '100%', color: props.gradient[5] }
            ])
            .enter()
            .append('stop')
            .attr('offset', function (d) {
              return d.offset
            })
            .attr('stop-color', function (d: { color: string }) {
              return d.color
            } as unknown as string)

          const brush = d3
            .brushX()
            .extent([
              [0, 0],
              [width, height]
            ])
            .on('end', updateChart)

          const area = svg.append('g').attr('clip-path', 'url(#clip)')

          const areaGenerator = d3
            .area()
            .x((d) => x((d as unknown as { date: Date }).date))
            .y0(y(0))
            .y1((d) => y((d as unknown as { value: number }).value))
          area
            .append('path')
            .datum(data)
            .attr('class', 'myArea')
            // .attr('fill', '#222')
            // .attr('fill-opacity', 0.3)
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .attr('d', areaGenerator as unknown as () => string)

          area.append('g').attr('class', 'brush').call(brush)

          let idleTimeout: ReturnType<typeof setTimeout> | null = null
          function idled() {
            idleTimeout = null
          }

          function updateChart(event: { selection: unknown }) {
            const extent = event.selection

            if (!extent) {
              if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350))
              x.domain([4, 8])
            } else {
              x.domain([x.invert((extent as unknown as number[])[0]), x.invert((extent as unknown as number[])[1])])
              area.select('.brush').call((brush as unknown as { move: () => void }).move, null)
            }

            xAxis.transition().duration(1000).call(d3.axisBottom(x))
            area
              .select('.myArea')
              .transition()
              .duration(1000)
              .attr('d', areaGenerator as unknown as () => string)
          }

          svg.on('dblclick', function () {
            x.domain(d3.extent(data as never, (d: { date: string }) => d.date) as unknown as [Date, number])
            xAxis.transition().call(d3.axisBottom(x))
            area
              .select('.myArea')
              .transition()
              .attr('d', areaGenerator as unknown as () => string)
          })
        })
      }
    }

    onMounted(() => {
      mountGraph()
    })

    return {
      graphRef
    }
  }
})
</script>
