document.addEventListener('alpine:init', () => {
    Alpine.data('bookmarks', () => ({
        f: '', // file name without extension e.g. default => will be 'default.json'
        links: [],
        groups: [],
        q: '', // search query

        async init() {
            try {
                // load the file name from URL if present otherwise use 'default'
                this.f = new URLSearchParams(window.location.search).get('f') || 'default';
                this.links = await (await fetch('data/' + this.f + '.json')).json();
                // load the search query from URL if present otherwise use default
                const q = new URLSearchParams(window.location.search).get('q') || '';
                this.q = q
                this.search(q)
            } catch (err) {
                console.log("error loading json from: " + this.f, err)
            }
        },

        search(q) {
            // split the query string by whitespace into an array
            const keywords = q.trim().split(/\s+/)

            //filter links, only links' name or tags contain the keywords, that contains all the keywords meet the filter
            const filteredLinks = this.links.filter(link => {
                return keywords.every(keyword => {
                    return link.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
                        || link.tag.some(tag => tag.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
                })
            })

            // group the filtered links into groups by 'tag' field (array) in each link, so that each group has a group name (tag) and multiple links
            this.groups = filteredLinks.reduce((groups, link) => {
                link.tag.forEach(tag => {
                    if (!groups[tag]) {
                        groups[tag] = []
                    }
                    groups[tag].push(link)
                })
                return groups
            }, {})

            // console.log(this.groups)

            // update the URL with the search query
            const url = new URL(window.location)
            if (q) { // only update the q parameter if the value is not blank
                url.searchParams.set('q', q)
            } else {
                url.searchParams.delete('q')
            }
            window.history.replaceState(null, '', url.toString())
        }
    }))

})