import { Component, FontAwesomeIcon } from 'substance'
import FormRowComponent from '../shared/FormRowComponent'

export default class TranslateableEditor extends Component {
  render ($$) {
    const model = this.props.model
    const originalText = model.getOriginalText()
    const languages = this._getArticleLanguages()
    const availableLanguages = this._getAvailableLanguages()
    let ModelEditor = this.getComponent(originalText.type)

    let el = $$('div')
      .addClass('sc-translatable-editor')
      .attr('data-id', model.id)

    el.append(
      $$('div').addClass('se-header').append(this.getLabel(model.id))
    )

    let originalRow = $$(FormRowComponent, {
      label: this.getLabel('original-translation')
    })
    originalRow.append(
      $$(ModelEditor, { model: originalText })
    )
    el.append(originalRow)

    model.getTranslations().forEach(translation => {
      let text = translation.getText()
      let lang = translation.getLanguageCode().getValue()
      let langName = languages[lang]
      let translRow = $$(FormRowComponent, {
        label: langName
      })
      // TODO: is it ok to assume that the editor of the original text is the same type as the translations?
      translRow.append(
        $$(ModelEditor, { model: text })
      )
      el.append(
        translRow.append(
          $$('div').addClass('se-remove').append(
            $$(FontAwesomeIcon, { icon: 'fa-remove' }).addClass('se-icon')
          ).on('click', this._removeLanguage.bind(this, lang))
        )
      )
    })

    if(availableLanguages.length > 0) {
      let footerEl = $$('div').addClass('se-footer')

      if(this.state.dropdown) {
        footerEl.append(this._renderLanguageDropdown($$))
      } else {
        footerEl.append(
          $$('div').addClass('se-control').append(
            this.getLabel('add-translation')
          ).on('click', this._toggleDropdown)
        )
      }

      el.append(footerEl)
    }

    return el
  }

  _renderLanguageDropdown($$) {
    const languages = this._getArticleLanguages()
    const availableLanguages = this._getAvailableLanguages()

    const el = $$('select').addClass('se-select')
      .on('change', this._addTranslation)

    el.append(
      $$('option').append(this.getLabel('select-language'))
    )

    availableLanguages.forEach(lang => {
      el.append(
        $$('option').attr({value: lang}).append(languages[lang])
      )
    })

    return el
  }

  _addTranslation(e) {
    const value = e.target.value
    const model = this.props.model
    model.addTranslation(value)

    this._toggleDropdown()
  }

  _removeLanguage(lang) {
    const model = this.props.model
    model.removeTranslation(lang)
  }

  _toggleDropdown() {
    const dropdown = this.state.dropdown
    this.extendState({dropdown: !dropdown})
  }

  _getArticleLanguages() {
    const configurator = this.context.configurator
    return configurator.getAvailableLanguages()
  }

  _getAvailableLanguages() {
    const model = this.props.model
    const languages = this._getArticleLanguages()
    const languageCodes = Object.keys(languages)
    const alreadyTranslated = model.getTranslations().map(t => t.getLanguageCode().getValue())
    // HACK: english is hardcoded here as original language
    // we will need to use default lang setting from article level
    alreadyTranslated.push('en')
    return languageCodes.filter(l => !alreadyTranslated.find(t => t === l))
  }
}