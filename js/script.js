const findBt = document.querySelector('.find-bt')
, modal = document.querySelector('.modal')
, body = document.querySelector('body')
, closeBt = document.querySelector('.modal-close-bt')
, blackOverlay = document.querySelector('.black-overlay')
, formInput = document.querySelector('.content-input')
, warningText = document.querySelector('.warning-text')
, modalCard = document.querySelector('.modal-card')
, loading = document.querySelector('.loading')
, searchSuggestion = document.querySelector('.search-suggestion')
, searchSuggestionContent = document.querySelector('.search-suggestion-content')
, detailContentContainer = document.querySelector('.card-content-container')
, detailTitle = document.querySelector('.detail-title')
, detailPhoto = document.querySelector('.detail-thumbnail')

// Api Configuration
const apikey = '39f6b61f'
, url = `http://www.omdbapi.com/?apikey=${apikey}`;

findBt.addEventListener('click', function (e) {

    const searchQuery = formInput.value

    if (searchQuery.length >= 2) {

        fetchData(url, `s=${searchQuery}`)
            .then(response => {

                let data = ''

                console.log(response)

                if (response.Response != 'False') {

                    response.Search.forEach(function (e) {
                        data += `<li><a class="open-data" data-id="${e.imdbID}" href="#">${e.Title}</a></li>`
                    })


                } else {
                    data += data += `<li><a data-id="" href="#">${response.Error}</a></li>`
                }

                searchSuggestionContent.innerHTML = data
                searchSuggestion.style.display = 'block'

                const openData = document.querySelectorAll('.open-data')

                openData.forEach(e => {
                    e.addEventListener('click', (e) => {
                        
                        const url = `http://www.omdbapi.com/?apikey=${apikey}`,
                        q = e.srcElement.getAttribute('data-id')
                        
                        console.log(q)

                        e.preventDefault()
                        
                        fetchData(url, `i=${q}`, () => {
                            loading.style.display = 'block'
                        })
                        .then(response => {

                            detailPhoto.src = 'img/loading.gif'

                            // Fill Details
                            let content = `
                                <li><strong>Tipe</strong> : ${response.Type}</li>
                                <li><strong>Tahun</strong> : ${response.Year}</li>
                                <li><strong>Rate</strong> : ${response.Rated}</li>
                                <li><strong>Dirilis</strong> : ${response.Released}</li>
                                <li><strong>Durasi</strong> : ${response.Runtime}</li>
                                <li><strong>Genre</strong> : ${response.Genre}</li>
                                <li><strong>Sutradara</strong> : ${response.Director}</li>
                                <li><strong>Produksi</strong> : ${response.Production}</li>
                                <li><strong>Aktor</strong> : ${response.Actors}</li>
                                <li><strong>Bahasa</strong> : ${response.Language}</li>
                                <li><strong>Negara</strong> : ${response.Country}</li>
                                <li><strong>Penghargaan</strong> : ${response.Awards}</li>
                                <li><strong>Jalan Cerita</strong> : ${response.Plot}</li>
                            `
                            detailTitle.innerHTML = response.Title
                            detailPhoto.src = response.Poster
                            detailContentContainer.innerHTML = content

                            loading.style.display = 'none'

                            toggleModal('on')
                        })
                    })
                })

            })

    } else {
        searchSuggestion.style.display = 'none'
    }

})

formInput.addEventListener('keyup', (e) => {
    if (e.code == 'Enter') findBt.click()
})

closeBt.addEventListener('click', function () {
    toggleModal('off')
})

function toggleModal(state) {
    if (state == 'on') {
        closeBt.style.transform = 'translateY(0)'
        body.style.overflow = 'hidden'
        window.scrollTo(0,0)
        blackOverlay.style.display = 'block'
        modal.style.transform = 'translateY(0)'
    } else {
        closeBt.style.transform = 'translateY(-200%)'
        body.style.overflow = 'auto'
        blackOverlay.style.display = 'none'
        modal.style.transform = 'translateY(-200%)'
    }
}

function fetchData(url, searchQuery, finallyCallback) {

    let callback = finallyCallback || function(){}

    return fetch(`${url}&${searchQuery}`)
        .catch(response => alert(response))
        .finally(callback())
        .then(response => response.json())
        .then(response => response)
}