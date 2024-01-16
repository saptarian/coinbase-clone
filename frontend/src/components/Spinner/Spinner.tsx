import './Spinner.css'


const Spinner: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = 
({className, ...rest}) => (
  <div className={
    `loader ${className ?? ""}`
    } {...rest} 
  />
)

export default Spinner
