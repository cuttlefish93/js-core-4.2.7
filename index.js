const searchBlock = document.querySelector('.search')
const searchField = document.querySelector('.search__field')
const resultsList = document.querySelector('.search__list')
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

searchField.addEventListener('input', () => {
	clearTimeout(time)
	time = setTimeout(getRepos, 1000)
})

resultFields.forEach(field => {
	field.addEventListener('click', e => {
		const template = document.querySelector('#repo')
		const repoClone = template.content.firstElementChild.cloneNode(true)
		const name = repoClone.querySelector('#name')
		const owner = repoClone.querySelector('#owner')
		const stars = repoClone.querySelector('#stars')

		name.textContent = e.currentTarget.textContent
		owner.textContent = e.currentTarget.dataset.owner
		stars.textContent = e.currentTarget.dataset.stars

		document
			.querySelector('.repos')
			.insertAdjacentElement('afterbegin', repoClone)

		repoClone
			.querySelector('.btn-close')
			.addEventListener('click', e => e.currentTarget.closest('.repo').remove())

		searchBlock.style.paddingBottom = '40px'
		searchField.value = ''
		resultsList.style.display = 'none'
	})
})
