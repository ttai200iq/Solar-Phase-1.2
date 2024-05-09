import React from 'react'
import './index.scss'
import { Link } from 'react-router-dom'

export default function NotfoundErr() {
  return (
    <div className="Error_content">
      <svg viewBox="0 0 960 300">
        <symbol id="s-text">
          <text textAnchor="middle" x="50%" y="50%">404</text>
        </symbol>

        <g className="g-ants">
          <use xlinkHref="#s-text" className="text"></use>
          <use xlinkHref="#s-text" className="text"></use>
          <use xlinkHref="#s-text" className="text"></use>
          <use xlinkHref="#s-text" className="text"></use>
          <use xlinkHref="#s-text" className="text"></use>
        </g>
      </svg>

      <div className='Error_content_NotFound' >
        <div className='Error_content_NotFound_title'>Page Not Found</div>
        <Link to='/'>
          <div className='Error_content_NotFound_home'>Back to Home</div>
        </Link>
      </div>

    </div>
  )
}
