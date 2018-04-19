// @flow

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form, Button } from 'carbon-components-react'
import { TextInput } from 'polymath-ui'
import {
  required,
  maxLength,
  alphanumeric,
} from 'polymath-ui/dist/validate'
import { TickerRegistry } from 'polymathjs'

export const formName = 'ticker'

const maxLength100 = maxLength(100)

type Props = {
  handleSubmit: () => void,
}

class TickerForm extends Component<Props> {
  render () {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <div className='ticker-field'>
          <Field
            name='ticker'
            component={TextInput}
            label='Enter Token Symbol'
            placeholder='4 characters (for example: TORO)'
          />
        </div>
        <Field
          name='name'
          component={TextInput}
          label='Token name'
          placeholder='Enter token name'
          validate={[required, maxLength100]}
        />
        <Button type='submit'>
          Register token symbol
        </Button>
        <p className='pui-input-hint'>
          By registering your token symbol with Polymath you agree to our Terms and Conditions
        </p>
      </Form>
    )
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  asyncValidate: async (values) => {
    // async validation doesn't work properly with field-level validation, so we need to specify sync rules here
    const v = values.ticker
    const syncError = required(v) || maxLength(4)(v) || alphanumeric(v)
    if (syncError) {
      // eslint-disable-next-line
      throw { ticker: syncError }
    }
    let details = null
    try {
      details = await TickerRegistry.getDetails(v)
    } catch (err) {
      // eslint-disable-next-line
      console.error('Error fetching details', err)
    }

    if (details !== null) {
      // eslint-disable-next-line
      throw { ticker: 'Specified ticker is already exists.' }
    }
  },
  asyncBlurFields: ['ticker'],
})(TickerForm)
