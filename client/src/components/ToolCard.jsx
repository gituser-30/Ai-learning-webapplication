

import { Link } from "react-router-dom";

const ToolCard = ({ title, description, icon, color, link }) => {
  return (
    <div className="col-md-4">
      <Link to={link} className="tool-card-link">
        <div className="tool-card">

          <div className="icon-badge" style={{ background: color }}>
            {icon}
          </div>

          <h5 className="tool-title">{title}</h5>
          <p className="tool-desc">{description}</p>

          <span className="tool-cta">Open tool →</span>

        </div>
      </Link>
    </div>
  );
};

export default ToolCard;
