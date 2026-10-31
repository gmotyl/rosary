import {describe, it, expect, vi, beforeAll} from 'vitest'
import {useState} from 'react'
import {render, screen, fireEvent, within} from '@testing-library/react'

import i18n from 'src/i18n'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {MysteryPicker} from '..'

// Labels are asserted in Polish, so use the real i18n instance
vi.unmock('react-i18next')

const Harness = ({
  initial,
  onChange,
}: {
  initial: MysteryTypes
  onChange: (m: MysteryTypes) => void
}) => {
  const [value, setValue] = useState(initial)
  return (
    <MysteryPicker
      label="Moja tajemnica"
      value={value}
      onChange={(m) => {
        setValue(m)
        onChange(m)
      }}
    />
  )
}

const pickPart = (part: string) => {
  fireEvent.click(screen.getByRole('button', {name: 'Zmień grupę tajemnic'}))
  fireEvent.click(screen.getByRole('menuitem', {name: part}))
}

describe('MysteryPicker', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('pl')
  })

  it('preselects the part and mystery of the initial value', () => {
    render(<Harness initial={MysteryTypes.Sorrowful2} onChange={vi.fn()} />)
    const group = screen.getByRole('group', {name: 'Moja tajemnica'})
    expect(within(group).getByText('Tajemnice bolesne')).toBeInTheDocument()
    expect(within(group).getByTestId('rosary-header-subtitle')).toHaveTextContent(
      'Biczowanie Pana Jezusa',
    )
    expect(within(group).getByTestId('decade-dot-2')).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  it('picking a part jumps to its first mystery, like the normal rosary', () => {
    const onChange = vi.fn()
    render(<Harness initial={MysteryTypes.Joyful3} onChange={onChange} />)
    pickPart('Tajemnice chwalebne')
    expect(onChange).toHaveBeenLastCalledWith(MysteryTypes.Glorious1)
    expect(screen.getByTestId('rosary-header-trigger')).toHaveTextContent(
      'Tajemnice chwalebne',
    )
  })

  it('part then mystery yields the right mystery', () => {
    const onChange = vi.fn()
    render(<Harness initial={MysteryTypes.Joyful1} onChange={onChange} />)
    pickPart('Tajemnice bolesne')
    fireEvent.click(
      screen.getByRole('button', {
        name: '2 tajemnica bolesna: Biczowanie Pana Jezusa',
      }),
    )
    expect(onChange).toHaveBeenLastCalledWith(MysteryTypes.Sorrowful2)
    expect(screen.getByTestId('rosary-header-subtitle')).toHaveTextContent(
      'Biczowanie Pana Jezusa',
    )
  })
})
