import { describe, it, expect } from 'vitest'
import { renderWithProviders } from './test-utils'

describe('Test harness', () => {
  it('renders a trivial component', () => {
    const { getByText } = renderWithProviders(<div>hello</div>)
    expect(getByText('hello')).toBeInTheDocument()
  })
})
