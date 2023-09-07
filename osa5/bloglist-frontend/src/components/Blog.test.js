import { React } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('render blog title and author', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'test author',
    user: {
      name: 'test name',
      username: 'test username'
    }
  }
  const username = {
    username: 'test username'
  }

  render(<Blog blog={blog} user={username}/>)

  const blogTitle = screen.getByText('Component testing is done with react-testing-library test author')
  screen.debug(blogTitle)
  expect(blogTitle).toBeDefined()
})

test('clicking "view" button reveals all information of a blog', async () => {
  const blog = {
    title: '"view" button reveals it all',
    author: 'test author',
    likes: 1,
    url: 'testblog.com',
    user: {
      name: 'test name',
      username: 'test username'
    }
  }
  const username = {
    username: 'test username'
  }

  render(<Blog blog={blog} user={username}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const textElement = screen.getByText('"view" button reveals it all test author likes 1 test name')
  expect(textElement).toBeDefined()
  screen.debug(textElement)
  const aElement = screen.getByRole('link', { name: 'testblog.com' })
  expect(aElement).toHaveTextContent('testblog.com')
})

test('when like-button is pressed twice, the event handler function is called twice', async () => {
  const blog = {
    title: '"like" button pressed twice',
    author: 'test author',
    likes: 0,
    url: 'testblog.com',
    user: {
      name: 'test name',
      username: 'test username'
    }
  }
  const username = {
    username: 'test username'
  }

  const mockHandler = jest.fn()

  const { container } = render(<Blog blog={blog} user={username} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = container.querySelector('.likeButton')
  await user.click(likeButton)
  await user.click(likeButton)

  screen.debug()
  expect(mockHandler.mock.calls).toHaveLength(2)
})

