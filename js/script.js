const findBt = document.querySelector('.find-bt'),
    modal = document.querySelector('.modal'),
    body = document.querySelector('body'),
    closeBt = document.querySelector('.modal-close-bt'),
    blackOverlay = document.querySelector('.black-overlay'),
    formInput = document.querySelector('.content-input'),
    warningText = document.querySelector('.warning-text'),
    modalCard = document.querySelector('.modal-card'),
    loading = document.querySelector('.loading'),
    searchSuggestion = document.querySelector('.search-suggestion'),
    searchSuggestionContent = document.querySelector('.search-suggestion-content'),
    detailContentContainer = document.querySelector('.card-content-container'),
    detailTitle = document.querySelector('.detail-title'),
    detailPhoto = document.querySelector('.detail-thumbnail')

// Api Configuration
const apikey = '39f6b61f',
    url = `http://www.omdbapi.com/?apikey=${apikey}`;

findBt.addEventListener('click', async function (e) {

    const searchQuery = formInput.value

    if (searchQuery.length >= 2) {

        const res = await fetchData(url, `s=${searchQuery}`)

        const searchResult = fillSearchResult(res)

        searchResult.forEach(sr => {

            sr.addEventListener('click', async e => {

                const url = `http://www.omdbapi.com/?apikey=${apikey}`,
                q = e.srcElement.getAttribute('data-id'),
                detail = await fetchData(url, `i=${q}`, () => loading.style.display = 'block')

                fillData(detail)

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
        window.scrollTo(0, 0)
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

    let callback = finallyCallback || function () {}

    return fetch(`${url}&${searchQuery}`)
        .finally(callback())
        .catch(response => alert(response))
        .then(response => response.json())
}

function fillData(source) {

    let content = `
        <li><strong>Tipe</strong> : ${source.Type}</li>
        <li><strong>Tahun</strong> : ${source.Year}</li>
        <li><strong>Rate</strong> : ${source.Rated}</li>
        <li><strong>Dirilis</strong> : ${source.Released}</li>
        <li><strong>Durasi</strong> : ${source.Runtime}</li>
        <li><strong>Genre</strong> : ${source.Genre}</li>
        <li><strong>Sutradara</strong> : ${source.Director}</li>
        <li><strong>Produksi</strong> : ${source.Production}</li>
        <li><strong>Aktor</strong> : ${source.Actors}</li>
        <li><strong>Bahasa</strong> : ${source.Language}</li>
        <li><strong>Negara</strong> : ${source.Country}</li>
        <li><strong>Penghargaan</strong> : ${source.Awards}</li>
        <li><strong>Jalan Cerita</strong> : ${source.Plot}</li>
    `
    detailTitle.innerHTML = source.Title
    detailPhoto.src = source.Poster
    detailContentContainer.innerHTML = content

    loading.style.display = 'none'

    toggleModal('on')
}

function fillSearchResult(source) {

    let data = ''

    if (source.Response != 'False') {

        source.Search.forEach(function (e) {
            data += `<li><a class="open-data" data-id="${e.imdbID}" href="#">${e.Title}</a></li>`
        })

        searchSuggestionContent.innerHTML = data
        searchSuggestion.style.display = 'block'

        return document.querySelectorAll('.open-data')

    } else {
        data += data += `<li><a data-id="" href="#">${source.Error}</a></li>`
    }
}