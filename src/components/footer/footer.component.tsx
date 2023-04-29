export function FooterComponent() {
  return (
    <footer className="footer" style={{position: 'absolute', bottom: 0, width: '-webkit-fill-available',}}>
      <div className="container-fluid">
        <div className="row">
          <nav className="footer-nav">
            {/* <ul>
              <li><a href="https://www.creative-tim.com" target="_blank">Creative Tim</a></li>
              <li><a href="https://www.creative-tim.com/blog" target="_blank">Blog</a></li>
              <li><a href="https://www.creative-tim.com/license" target="_blank">Licenses</a></li>
            </ul> */}
          </nav>
          <div className="credits ml-auto">
            <span className="copyright">
              © 2023, desenvolvido com <i className="fa fa-heart heart"></i> por Gabriel Lampe
            </span>
          </div>
        </div>
      </div>
    </footer>
  )

}