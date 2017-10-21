// Vue components
Vue.component('keyboard', {
    template: '#keyboard',
    props: ['value'],
    data() {
        return {
            chars: [],
        }
    },
    mounted() {
        for(let i = 65; i <= 90; i++) {
            this.chars.push(String.fromCharCode(i))
        }
    },
    methods: {
        updateChars(char) {
            if(!this.value.includes(char)) this.$emit('input', char)
        },
    }
})

Vue.component('hangmanWord', {
    template: '#hangmanWord',
    props: ['show', 'word'],
})

// Vue instance
new Vue({
    el: "#app",
    data: {
        loaded: false,
        loadError: false,
        word: null,
        usedChars: [],
        healthPoints: 5,
        resolved: false,
        alert: false,
    },
    methods: {
        loadNewWord() {
            axios.get(YOUR_API_URL)
                .then((result) => {
                    this.word = result.data.word.toUpperCase()
                    this.loaded = true         
                })
                .catch((err) => {
                    console.error(err)
                    this.loadError = true
                    this.alert = true
                })
        },

        isResolved() {
            let resolved = true

            for(let i = 0; i < this.word.length && resolved; i++) {
                resolved = this.usedChars.includes(this.word[i])
            }

            return resolved
        },

        updateUsedChars(data) {
            if(!this.word.includes(data)) this.healthPoints--
            this.usedChars.push(data)

            this.resolved = this.isResolved()
            this.alert = this.resolved || this.healthPoints === 0
        },

        retry() {
            this.loaded = false
            this.loadError = false
            this.word = null
            this.usedChars = []
            this.healthPoints = 5
            this.resolved = false
            this.alert = false
            this.loadNewWord()
        }
    },
    mounted() {
        this.loadNewWord()
    },
    components: ['keyboard', 'hangmanWord']
})
