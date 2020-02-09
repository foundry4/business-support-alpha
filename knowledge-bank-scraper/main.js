const getStdin = require('get-stdin')
const { JSDOM } = require('jsdom')

const parsers = require('./parsers')

function parseHtml (html) {
  const { document } = (new JSDOM(html)).window
  const content = document.querySelector('[data-name=Content] #newDiv')
  if (!content) throw new Error('Content element (#newDiv) not found in stdin')
  const elements = Array.from(content.querySelectorAll('.lfs_block, h1'))
  const parsersEntries = Object.entries(parsers)

  // Loop through blocks and titles
  let currentCategory = null
  return elements.reduce((accumResourceList, element) => {
    if (element.tagName === 'H1') {
      // If title, update state and continue loop
      currentCategory = element.textContent
    } else {
      // If block, parse element and add to accumulated list
      const initialResource = { category: currentCategory }

      const resource = parsersEntries.reduce((accumResource, [key, parser]) => {
        accumResource[key] = parser(element)
        return accumResource
      }, initialResource)

      accumResourceList.push(resource)
    }
    return accumResourceList
  }, [])
}

getStdin()
  .then(parseHtml)
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch((err) => console.error(err))
