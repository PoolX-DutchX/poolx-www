import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Form, Input } from 'formsy-react-components'
import { feathersClient, feathersRest } from '../../lib/feathersClient'
import Loader from '../Loader'
import FormsyImageUploader from './../FormsyImageUploader'
import { isLoggedIn } from '../../lib/middleware'
import LoaderButton from '../../components/LoaderButton'
import User from '../../models/User'
import ErrorPopup from '../ErrorPopup'
import { history } from '../../lib/helpers'

/**
 * The edit user profile view mapped to /profile/
 *
 * @param currentUser  The current user's address
 */
class EditProfile extends Component {
  constructor(props) {
    super(props)

    if (props.currentUser) {
      this.state = {
        isLoading: true,
        isSaving: false,

        // user model
        name: props.currentUser.name,
        avatar: props.currentUser.avatar,
        email: props.currentUser.email,
        linkedIn: props.currentUser.linkedIn,
        uploadNewAvatar: false,
        isPristine: true,
      }
    }

    this.submit = this.submit.bind(this)
    this.setImage = this.setImage.bind(this)
    this.togglePristine = this.togglePristine.bind(this)
  }

  componentDidMount() {
    isLoggedIn(this.props.currentUser).then(() =>
      this.setState({ isLoading: false })
    )
  }

  setImage(image) {
    this.setState({ avatar: image, uploadNewAvatar: true, isPristine: false })
  }

  async submit(model) {
    this.setState({ isSaving: true })

    const constructedModel = {
      name: model.name,
      email: model.email,
      linkedIn: model.linkedIn,
    }

    try {
      if (this.state.uploadNewAvatar) {
        const { url } = await feathersRest
          .service('uploads')
          .create({ uri: this.state.avatar })
        constructedModel.avatar = url
      }

      const user = await feathersClient
        .service('/users')
        .patch(this.props.currentUser.id, constructedModel)

      React.toast.success('Your profile has been updated.')
      this.setState({
        isSaving: false,
        ...user,
      })
      this.props.onSignIn(user._id)
      history.push('/')
    } catch (err) {
      this.setState({ isSaving: false })
      React.toast.error(err.message)
      ErrorPopup(
        'There has been a problem updating your user profile. Please refresh the page and try again.',
        err
      )
    }
  }

  togglePristine(currentValues, isChanged) {
    this.setState({ isPristine: !isChanged })
  }

  render() {
    const {
      isLoading,
      isSaving,
      name,
      email,
      linkedIn,
      avatar,
      isPristine,
    } = this.state
    console.log('this.props.currentUser', this.props.currentUser)
    return (
      <div id="edit-cause-view" className="container-fluid page-layout">
        <div className="row">
          <div className="col-md-8 m-auto">
            {isLoading && <Loader className="fixed" />}

            {!isLoading && (
              <div>
                <h3>Edit your profile</h3>
                <p>
                  <i className="fa fa-question-circle" />
                  Trust is important to run successful Communities or Campaigns.
                  Without trust you will likely not receive donations.
                  Therefore, we strongly recommend that you{' '}
                  <strong>fill out your profile </strong>
                  when you want to start Communities or Campaigns on Giveth.
                </p>

                <Form
                  onSubmit={this.submit}
                  mapping={inputs => ({
                    name: inputs.name,
                    email: inputs.email,
                    linkedIn: inputs.linkedIn,
                  })}
                  onChange={this.togglePristine}
                  layout="vertical"
                >
                  <div className="form-group">
                    <Input
                      name="name"
                      id="name-input"
                      label="Your name"
                      type="text"
                      value={name}
                      placeholder="John Doe."
                      validations="minLength:3"
                      validationErrors={{
                        minLength: 'Please enter your name',
                      }}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <Input
                      name="email"
                      label="Email"
                      value={email}
                      placeholder="email@example.com"
                      validations="isEmail"
                      help="Please enter your email address."
                      validationErrors={{
                        isEmail: "Oops, that's not a valid email address.",
                      }}
                      required
                    />
                  </div>

                  <FormsyImageUploader
                    setImage={this.setImage}
                    avatar={avatar}
                    aspectRatio={1}
                  />

                  <div className="form-group">
                    <Input
                      name="linkedIn"
                      label="Your Profile"
                      type="text"
                      value={linkedIn}
                      placeholder="Your profile url"
                      help="Provide a link to some more info about you, this will help to build trust. You could add your LinkedIn profile, Twitter account or a relevant website."
                      validations="isUrl"
                      validationErrors={{
                        isUrl: 'Please enter a valid url',
                      }}
                    />
                  </div>

                  <LoaderButton
                    className="btn btn-success"
                    formNoValidate
                    type="submit"
                    disabled={isSaving || isPristine}
                    isLoading={isSaving}
                    loadingText="Saving..."
                  >
                    Save profile
                  </LoaderButton>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

EditProfile.propTypes = {
  currentUser: PropTypes.instanceOf(User),
}

EditProfile.defaultProps = {
  currentUser: undefined,
}

export default EditProfile
