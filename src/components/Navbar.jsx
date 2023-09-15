import PropTypes from 'prop-types';
import { Flex, Spacer, Button } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const Navbar = ({ onOpen }) => {
    return (
        <Flex mb="8">
            <Flex align="center">
                <StarIcon color="teal.300" />
                &nbsp;Main Course
            </Flex>
            <Spacer />
            <Button
                colorScheme="teal"
                variant="outline"
                onClick={onOpen}
            >
                Keranjang
            </Button>
        </Flex>
    );
};

Navbar.propTypes = {
    onOpen: PropTypes.func,
}

export default Navbar;