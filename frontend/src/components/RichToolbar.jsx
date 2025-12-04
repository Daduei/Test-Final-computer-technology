import React from 'react'
import './RichToolbar.css'

export default function RichToolbar({ applyFormat, selectedFont, setSelectedFont, selectedSize, setSelectedSize }) {
  // size is controlled by parent via selectedSize; keep local handlers
  const decrement = () => {
    const next = Math.max(8, (selectedSize || 15) - 1)
    setSelectedSize(next)
    applyFormat('setFontSizePx', String(next))
  }

  const increment = () => {
    const next = Math.min(72, (selectedSize || 15) + 1)
    setSelectedSize(next)
    applyFormat('setFontSizePx', String(next))
  }

  const onSizeInput = (e) => {
    const v = parseInt(e.target.value, 10)
    if (!isNaN(v)) {
      const clamped = Math.max(8, Math.min(72, v))
      setSelectedSize(clamped)
      applyFormat('setFontSizePx', String(clamped))
    }
  }

  return (
    <div className="rich-toolbar">
      {/* Font family first */}
      <select
        aria-label="Font family"
        className="rt-font-select"
        value={selectedFont || ''}
        onChange={(e) => {
          const val = e.target.value
          if (val) {
            applyFormat('fontName', val)
            setSelectedFont(val)
          }
        }}
      >
        <option value="">Font</option>
        <option value="Times New Roman">Times New</option>
        <option value="Arial">Arial</option>
        <option value="Helvetica Neue">Helvetica</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier</option>
      </select>

      {/* separator between font and size */}
      <div className="rt-separator" aria-hidden="true" />

      {/* size controls: - [input] + */}
      <div className="rt-size-controls">
        <button type="button" className="rt-size-btn" onClick={decrement} aria-label="Decrease font size">−</button>
        <input className="rt-size-input" value={selectedSize || 15} onChange={onSizeInput} aria-label="Font size" />
        <button type="button" className="rt-size-btn" onClick={increment} aria-label="Increase font size">+</button>
      </div>
      {/* separator between size and emphasis */}
      <div className="rt-separator" aria-hidden="true" />

      {/* emphasis buttons */}
      <button type="button" onClick={() => applyFormat('bold')} title="Bold"><strong>B</strong></button>
      <button type="button" onClick={() => applyFormat('italic')} title="Italic"><em>I</em></button>
      <button type="button" onClick={() => applyFormat('underline')} title="Underline"><u>U</u></button>

      {/* color */}
      <input
        type="color"
        title="Text color"
        aria-label="Text color"
        onChange={(e) => applyFormat('foreColor', e.target.value)}
      />
    </div>
  )
}
