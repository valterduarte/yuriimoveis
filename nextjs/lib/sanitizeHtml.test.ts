import { describe, it, expect } from 'vitest'
import { sanitizeBlogHtml } from './sanitizeHtml'

describe('sanitizeBlogHtml', () => {
  it('strips <script> tags', () => {
    const out = sanitizeBlogHtml('<p>ok</p><script>alert(1)</script>')
    expect(out).toBe('<p>ok</p>')
  })

  it('strips inline event handlers', () => {
    const out = sanitizeBlogHtml('<img src="x" onerror="alert(1)">')
    expect(out).not.toContain('onerror')
  })

  it('strips javascript: in href', () => {
    const out = sanitizeBlogHtml('<a href="javascript:alert(1)">x</a>')
    expect(out).not.toMatch(/javascript:/i)
  })

  it('strips <iframe>', () => {
    const out = sanitizeBlogHtml('<iframe src="https://evil.com"></iframe><p>after</p>')
    expect(out).not.toContain('<iframe')
    expect(out).toContain('<p>after</p>')
  })

  it('strips <style> tags (CSS-based XSS surface)', () => {
    const out = sanitizeBlogHtml('<style>body{}</style><p>ok</p>')
    expect(out).not.toContain('<style')
  })

  it('strips inline style attribute', () => {
    const out = sanitizeBlogHtml('<p style="color:red">ok</p>')
    expect(out).not.toContain('style=')
  })

  it('preserves common prose tags', () => {
    const input = '<h2>T</h2><p>p</p><ul><li>i</li></ul><a href="https://x.com">link</a><strong>b</strong>'
    const out = sanitizeBlogHtml(input)
    expect(out).toContain('<h2>T</h2>')
    expect(out).toContain('<p>p</p>')
    expect(out).toContain('<ul><li>i</li></ul>')
    expect(out).toContain('<a href="https://x.com">link</a>')
    expect(out).toContain('<strong>b</strong>')
  })

  it('preserves table markup', () => {
    const out = sanitizeBlogHtml('<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>d</td></tr></tbody></table>')
    expect(out).toContain('<table>')
    expect(out).toContain('<th>h</th>')
    expect(out).toContain('<td>d</td>')
  })

  it('preserves images with safe src/alt', () => {
    const out = sanitizeBlogHtml('<img src="https://res.cloudinary.com/x.jpg" alt="a" loading="lazy">')
    expect(out).toContain('<img')
    expect(out).toContain('src="https://res.cloudinary.com/x.jpg"')
    expect(out).toContain('alt="a"')
  })

  it('balances unclosed tags (split fragment safety)', () => {
    const out = sanitizeBlogHtml('<div><p>unclosed')
    expect(out).toContain('<p>unclosed</p>')
  })

  it('strips <form> and <input> (no form hijacking)', () => {
    const out = sanitizeBlogHtml('<form><input name="x"></form><p>p</p>')
    expect(out).not.toContain('<form')
    expect(out).not.toContain('<input')
    expect(out).toContain('<p>p</p>')
  })

  it('handles empty input', () => {
    expect(sanitizeBlogHtml('')).toBe('')
  })
})
