Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
    el: "#app",
    data: {
        loading: false,
        searchEntry: '',
        favorites: [],
        booklist: [],
        
    },
    methods: {
        async searchBook() {
            try {
                this.booklist = [];
                this.loading = true;
                const response = await axios.get('https://openlibrary.org/search.json?q=' + this.searchEntry);
                console.log(response);
                for (i in response.data.docs)
                {
                    var tempTitle = '';
                    var tempAuthor = '';
                    var tempDate = '';
                    var tempisbn = '';
                    var tempURL = '';
                    var divcont = '';

                    if (response.data.docs[i].title_suggest !== undefined) {
                        tempTitle = response.data.docs[i].title_suggest;
                    }
                    if (response.data.docs[i].author_name !== undefined) {
                        tempAuthor = response.data.docs[i].author_name[0];
                    }
                    if (response.data.docs[i].first_publish_year !== undefined) {
                        tempDate = response.data.docs[i].first_publish_year;
                    }
                    if (response.data.docs[i].isbn !== undefined) {
                        tempisbn = response.data.docs[i].isbn[0];
                        divcont = "ISBN:" + tempisbn;
                    }

                    const imgResponse = await axios.get('https://openlibrary.org/api/books?bibkeys=ISBN:' + tempisbn + '&jscmd=details&format=json')
                    console.log(imgResponse);
                    if ((imgResponse.data["ISBN:" + tempisbn] !== undefined) && (imgResponse.data["ISBN:" + tempisbn].thumbnail_url !== undefined)) {
                        tempURL = imgResponse.data["ISBN:" + tempisbn].thumbnail_url;
                    }

                    this.booklist.push({
                        title: tempTitle,
                        author: tempAuthor,
                        publishDate: tempDate,
                        imgURL: tempURL,
                    });
                }
                this.loading = false;
                searchEntry = '';
            } catch (error) {
                console.log(error);
            }
        },
        makeFavorite(book) {
            this.favorites.push(book);
        },
        unFavorite(book) {
            var index = this.favorites.indexOf(book);
            this.favorites.splice(index,1);
        }
    },
});