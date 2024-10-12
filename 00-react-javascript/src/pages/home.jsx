import { CrownOutlined } from '@ant-design/icons';
import { Result } from 'antd';

const HomePage = () => {
    return (
        <div>
            <Result
                icon={<CrownOutlined />}
                title="JSON Web Token (React/Node.JS) - createdBy @Bobby"
            />
        </div>
    )
}

export default HomePage;