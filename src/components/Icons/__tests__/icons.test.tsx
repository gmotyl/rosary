import {renderWithTheme} from 'src/tools/renderWithTheme'
import {RosaryIcon} from '../index'

describe('Icons', () => {
  it('should render RosaryIcon', () => {
    const {getByRole} = renderWithTheme(<RosaryIcon />)

    expect(getByRole('img')).toBeTruthy()
  })
})
