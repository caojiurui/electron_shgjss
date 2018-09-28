<template>
    <div>
        <component :is="boxMode"></component>
    </div>
</template>

<script>

	import Bus from './bus.vue';

	export default {
		components: {Bus},
		data() {
			return {
				boxMode: this.$route.params.type
			}
		},
		beforeCreate() {
		}
	}
</script>

<style scoped>
</style>
