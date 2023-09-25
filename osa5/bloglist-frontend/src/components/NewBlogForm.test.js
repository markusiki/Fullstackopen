import { React } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('HandleNewBlog function is called when new blog is being created', async () => {

  const user = userEvent.setup()
  const newBlog = {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl'
  }

  const mockHandler = jest.fn()

  const { container } = render(<NewBlogForm handleNewBlog={mockHandler} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  await user.type(titleInput, 'testTitle')
  await user.type(authorInput, 'testAuthor')
  await user.type(urlInput, 'testUrl')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(mockHandler.mock.calls[0][0]).toEqual(newBlog)
})