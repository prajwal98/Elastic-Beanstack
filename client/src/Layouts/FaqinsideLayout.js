import React, { useState } from 'react';
import Faqinside from '../components/Faq/Faqinside';
import Aside from '../modules/SideNav/Aside';

function FaqinsideLayout() {
    const rtl = false;

    const [toggled, setToggled] = useState(false);

    const handleToggleSidebar = value => {
        setToggled(value);
    };

    return (
        <div className={`app ${rtl ? 'rtl' : ''} ${toggled ? 'toggled' : ''}`}>
            <Aside
                rtl={rtl}
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
            />
            <Faqinside handleToggleSidebar={handleToggleSidebar} />
        </div>
    );
}

export default FaqinsideLayout;
