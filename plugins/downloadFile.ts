import Vue from 'vue'

Vue.mixin({
    methods: {
        downloadFileB64(string, mimetype, label) {
            const byteString = atob(string)
            const ab = new ArrayBuffer(byteString.length)
            const ia = new Uint8Array(ab)

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i)
            }

            const blob = new Blob([ab], {
                type: mimetype
            })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = label
            link.click()
            URL.revokeObjectURL(link.href)
        },
        downloadFileUrl(url, mimetype, label) {
            this.$axios({url, responseType: 'arraybuffer'}).then(function (
                response
            ) {
                const blob = new Blob([response.data], {
                    type: mimetype
                })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = label
                link.click()
                URL.revokeObjectURL(link.href)
            })
        },
        downloadFile(string, mimetype, label) {
            const blob = new Blob([string], {
                type: mimetype
            })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = label
            link.click()
            URL.revokeObjectURL(link.href)
        }
    }
})
