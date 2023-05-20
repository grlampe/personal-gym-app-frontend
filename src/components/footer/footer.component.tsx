export function FooterComponent() {
  return (
    <footer className="footer" style={{position: 'absolute', width: '-webkit-fill-available',}}>
      <div className="container-fluid">
        <div className="row">
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