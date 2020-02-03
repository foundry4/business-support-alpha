module.exports = {
  title (block) {
    const el = block.querySelector('.kb_t')
    if (!el) return null
    return el.textContent
  },
  who (block) {
    const whoDetail = module.exports.whoDetail(block)
    if (!whoDetail) return null
    const options = ['pre-start', 'start-up', 'established']
    const whoDetailLower = whoDetail.toLowerCase()
    return options.filter((option) => whoDetailLower.includes(option))
  },
  whoDetail (block) {
    const el = block.querySelector('.kb_w')
    if (!el) return null
    return getSiblingText(el).trim()
  },
  eligibility (block) {
    const el = block.querySelector('.kb_e')
    if (!el) return null
    return getSiblingText(el)
  },
  description (block) {
    // Description has no identifier, so find <p> tags with no class that don't
    // contain <span> tags.
    const paragraphsWithoutClasses = Array.from(block.querySelectorAll('p:not([class])'))
    const paragraphsWithoutSpans = paragraphsWithoutClasses.filter((paragraph) => !paragraph.querySelector('span'))
    if (paragraphsWithoutSpans.length === 0) return null
    return paragraphsWithoutSpans
      .map((paragraph) => paragraph.outerHTML)
      .join('')
  },
  website (block) {
    const el = block.querySelector('.kb_web + a')
    if (!el) return null
    return el.textContent
  },
  telephone (block) {
    const el = block.querySelector('.kb_tel')
    if (!el) return null
    return el.textContent.replace('Tel: ', '')
  },
  email (block) {
    const el = block.querySelector('.kb_mail + a')
    if (!el) return null
    return el.textContent
  }
}

function getSiblingText (el) {
  const children = el.parentNode.childNodes
  return children[children.length - 1].textContent
}
