class Leaderboard extends HTMLElement {

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    let template = document.getElementById(
      'leader-board-template'
    )
    let templateContent = template.content.cloneNode(true)
    shadow.appendChild(templateContent)
  }

}

customElements.define('leader-board', Leaderboard)


class LeaderboardItem extends HTMLElement {

  static get observedAttributes() {
    return [ 'data-score', 'data-rank' ];
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    let template = document.getElementById(
      'leader-board-item-template'
    )
    let templateContent = template.content.cloneNode(true)
    shadow.appendChild(templateContent)
    this.updateElement()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.');
    this.updateElement()
  }

  updateElement() {
    let shadow = this.shadowRoot
    if (this.hasAttribute('data-score')) {
      shadow.querySelector('.score').textContent =
        this.getAttribute('data-score')
    }
    if (this.hasAttribute('data-rank')) {
      shadow.querySelector('.rank').textContent =
        '#' + this.getAttribute('data-rank')
    }
  }
}

customElements.define('leader-board-item', LeaderboardItem)
