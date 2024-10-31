const Header = () => {
    return (
        <header className="dark:bg-gray-800">
            <nav className="container mx-auto bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto">
                    <p className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">ВкProject</p>
                    <div className="flex items-center lg:order-2">
                        <button data-collapse-toggle="mobile-menu-2" type="button"
                                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="mobile-menu-2" aria-expanded="false">
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;