import React from 'react'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {IntentionStatisticCard} from '../IntentionStatisticCard'

it.skip('should render rosary count', () => {
  const statisticProps = {
    rosaryCount: 0,
    prayFinished: 0,
    prayInProgress: 0,
  }

  const {queryAllByText, debug} = renderWithTheme(
    <IntentionStatisticCard {...statisticProps} />,
  )

  debug()
  expect(queryAllByText('Ukończonych różańców').length).toEqual(3)
})
