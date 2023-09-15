/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    GridItem,
    useDisclosure,
} from '@chakra-ui/react';
import { connect } from "react-redux";
import { addItem, decreaseQty, removeItem, updateItem } from "./redux/reducer";
import Navbar from './components/Navbar';
import Drawer from './components/Drawer';
import MenuCard from './components/MenuCard';
import { BASE_URL } from './utils/helper';

const mapStateToProps = (state) => {
    return {
        keranjang: state,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addItem: (obj) => dispatch(addItem(obj)),
        decreaseQty: (obj) => dispatch(decreaseQty(obj)),
        removeItem: (index) => dispatch(removeItem(index)),
        updateItem: (obj) => dispatch(updateItem(obj)),
    };
};

const App = (props) => {
    const { keranjang, addItem, decreaseQty, removeItem, updateItem } = props
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [menus, setMenus] = useState(null)

    const fetchMenu = async () => {
        try {
            const res = await fetch(BASE_URL + '/menus')
            const data = await res.json()
            setMenus(data.datas)
        } catch (error) {
            console.log(JSON.stringify(error))
        }
    }

    useEffect(() => {
        fetchMenu()
    }, [])

    return (
        <main>
            <Navbar onOpen={onOpen} />
            <Grid
                gap={5}
                templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
            >
                {menus?.map(menu => (
                    <GridItem
                        key={menu.id}
                        w='100%'
                    >
                        <MenuCard
                            item={menu}
                            addItem={addItem}
                            keranjang={keranjang}
                        />
                    </GridItem>
                ))}
            </Grid>
            <Drawer
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                keranjang={keranjang}
                addItem={addItem}
                removeItem={removeItem}
                updateItem={updateItem}
                decreaseQty={decreaseQty}
            />
        </main>
    );
};

App.propTypes = {
    keranjang: PropTypes.array,
    addItem: PropTypes.func,
    decreaseQty: PropTypes.func,
    removeItem: PropTypes.func,
    updateItem: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);