import { computed, defineComponent, h, inject, PropType, Ref, ref } from 'vue'
import { AlexElementsRangeType, AlexEditor } from 'alex-editor'
import { MenuButtonType } from '@/core/tool'
import { hasPreInRange, queryTextMark, removeTextMark, setTextMark } from '@/core/function'
import { Button } from '@/components/button'
import { Icon } from '@/components/icon'

/**
 * feature名称
 */
const FEATURE_NAME = 'code'

/**
 * 工具栏 - 行内代码
 */
export const CodeToolbarButton = defineComponent(
	(props, { expose }) => {
		const editor = inject<Ref<AlexEditor>>('editor')!
		const dataRangeCaches = inject<Ref<AlexElementsRangeType>>('dataRangeCaches')!
		const $editTrans = inject<(key: string) => any>('$editTrans')!

		const btnRef = ref<InstanceType<typeof Button> | null>(null)

		const active = computed<boolean>(() => queryTextMark(editor.value, dataRangeCaches.value, 'data-editify-code'))

		expose({
			btnRef
		})

		return () => {
			return props.config.show
				? h(
						Button,
						{
							ref: btnRef,
							name: FEATURE_NAME,
							title: $editTrans('code'),
							tooltip: props.tooltip,
							color: props.color,
							zIndex: props.zIndex,
							leftBorder: props.config.leftBorder,
							rightBorder: props.config.rightBorder,
							active: active.value,
							disabled: props.config.disabled,
							onOperate: () => {
								if (active.value) {
									removeTextMark(editor.value, dataRangeCaches.value, ['data-editify-code'])
								} else {
									setTextMark(editor.value, dataRangeCaches.value, {
										'data-editify-code': true
									})
								}
								editor.value.formatElementStack()
								editor.value.domRender()
								editor.value.rangeRender()
							}
						},
						{
							default: () => h(Icon, { value: 'code' })
						}
				  )
				: null
		}
	},
	{
		name: `_${FEATURE_NAME}`,
		props: {
			color: String as PropType<string | null>,
			zIndex: Number,
			config: Object as PropType<MenuButtonType>,
			tooltip: Boolean
		}
	}
)

/**
 * 菜单栏 - 行内代码
 */
export const CodeMenuButton = defineComponent(
	props => {
		const editor = inject<Ref<AlexEditor>>('editor')!
		const dataRangeCaches = inject<Ref<AlexElementsRangeType>>('dataRangeCaches')!
		const $editTrans = inject<(key: string) => any>('$editTrans')!
		const isSourceView = inject<Ref<boolean>>('isSourceView')!

		const active = computed<boolean>(() => editor.value && queryTextMark(editor.value, dataRangeCaches.value, 'data-editify-code'))

		return () => {
			return props.config.show
				? h(
						Button,
						{
							name: FEATURE_NAME,
							tooltip: props.tooltip,
							color: props.color,
							zIndex: props.zIndex,
							title: $editTrans('code'),
							leftBorder: props.config.leftBorder,
							rightBorder: props.config.rightBorder,
							disabled: props.disabled || isSourceView.value || !editor.value || hasPreInRange(editor.value, dataRangeCaches.value),
							active: active.value,
							onOperate: () => {
								if (!editor.value.range) {
									return
								}
								if (active.value) {
									removeTextMark(editor.value, dataRangeCaches.value, ['data-editify-code'])
								} else {
									setTextMark(editor.value, dataRangeCaches.value, {
										'data-editify-code': true
									})
								}
								editor.value.formatElementStack()
								editor.value.domRender()
								editor.value.rangeRender()
							}
						},
						{
							default: () => h(Icon, { value: 'code' })
						}
				  )
				: null
		}
	},
	{
		name: `_${FEATURE_NAME}`,
		props: {
			color: String as PropType<string | null>,
			zIndex: Number,
			config: Object as PropType<MenuButtonType>,
			tooltip: Boolean,
			disabled: Boolean
		}
	}
)
