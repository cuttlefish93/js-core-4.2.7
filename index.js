const main = document.createElement('main')
main.classList.add('content')
const searchBlock = document.createElement('div')
searchBlock.classList.add('search')
const searchField = document.createElement('input')
searchField.classList.add('search__field')
const resultsList = document.createElement('ul')
resultsList.classList.add('search__list')
const repos = document.createElement('div')
repos.classList.add('repos')

document.body.prepend(main)
main.append(searchBlock)
main.append(repos)
searchBlock.append(searchField)
searchBlock.append(resultsList)

for (let i = 0; i <= 4; i += 1) {
	const li = document.createElement('li')
	li.classList.add('search__item')
	li.setAttribute('data-owner', '')
	li.setAttribute('data-stars', '')
	resultsList.append(li)
}

const resultFields = document.querySelectorAll('.search__item')
let time

async function getRepos() {
	const value = searchField.value

	if (!value) {
		resultsList.style.display = 'none'
		return
	}

	const response = await fetch(
		`https://api.github.com/search/repositories?q=${value}`,
		{
			method: 'GET',
		}
	)
	const result = await response.json()
	const repos = result.items.slice(0, 5)

	resultFields.forEach(item => (item.textContent = ''))
	repos.forEach((repo, i) => {
		const name = repo.name
		const owner = repo.owner.login
		const stars = repo.stargazers_count
		const field = resultFields[i]
		field.textContent = name
		field.dataset.owner = owner
		field.dataset.stars = stars
	})

	searchBlock.style.paddingBottom = '340px'
	resultsList.style.display = 'block'
}

document.querySelector('.search__field').addEventListener('input', () => {
	clearTimeout(time)
	time = setTimeout(getRepos, 1000)
})

resultFields.forEach(field => {
	field.addEventListener('click', e => {
		const repo = document.createElement('div')
		repo.classList.add('repo')
		const repoContent = document.createElement('div')
		repoContent.classList.add('repo__content')
		const btn = document.createElement('button')
		btn.classList.add('btn-close')
		const span1 = document.createElement('span')
		const span2 = document.createElement('span')
		btn.append(span1)
		btn.append(span2)
		repo.append(repoContent)
		repo.append(btn)

		for (let i = 0; i <= 2; i += 1) {
			const repoField = document.createElement('div')
			repoField.classList.add('repo__field')
			const span1 = document.createElement('span')
			const span2 = document.createElement('span')

			if (i === 0) {
				span1.textContent = 'Name:'
				span2.setAttribute('id', 'name')
			}

			if (i === 1) {
				span1.textContent = 'Owner:'
				span2.setAttribute('id', 'owner')
			}

			if (i === 2) {
				span1.textContent = 'Stars:'
				span2.setAttribute('id', 'stars')
			}

			repoField.append(span1)
			repoField.append(span2)
			repoContent.append(repoField)
		}

		const name = repo.querySelector('#name')
		const owner = repo.querySelector('#owner')
		const stars = repo.querySelector('#stars')

		name.textContent = e.currentTarget.textContent
		owner.textContent = e.currentTarget.dataset.owner
		stars.textContent = e.currentTarget.dataset.stars

		repos.insertAdjacentElement('afterbegin', repo)

		btn.addEventListener('click', e =>
			e.currentTarget.closest('.repo').remove()
		)

		searchBlock.style.paddingBottom = '40px'
		searchField.value = ''
		resultsList.style.display = 'none'
	})
})
