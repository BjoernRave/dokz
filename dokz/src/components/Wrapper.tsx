/** @jsx jsx */
import {
    Box,
    ColorModeProvider,
    CSSReset,
    ThemeProvider,
    useColorMode,
    useTheme,
    theme,
    Button,
} from '@chakra-ui/core'
import { Stack, Flex } from 'layout-kit-react'
import merge from 'lodash/fp/merge'
import { jsx } from '@emotion/core'
import { useDokzConfig, TableOfContentsContext } from '../provider'
import NavBar from './NavBar'
import { SideNav } from './SideNav'
import { Global, css } from '@emotion/core'
import { FloatingTableOfContents } from './FloatingTableOfContents'
import { Fragment, useMemo } from 'react'
import { globalStyles, getMdxSidebarTree } from './support'
import { FooterButtons } from './FooterButtons'

const SIDENAV_W = 280
const TABLE_OF_C_W = 200

const NAVBAR_H = 62

export function Wrapper(props) {
    const { tableOfContents } = props.meta || {}
    const {
        footer,
        headerLogo,
        headerItems,
        maxPageWidth,
        bodyColor,
        fontSize,
        fontWeight,
        fontFamily,
    } = useDokzConfig()
    const index = getMdxSidebarTree()
    const { colorMode } = useColorMode()
    return (
        <PropagatedThemeProvider theme={theme}>
            <TableOfContentsContext.Provider value={{ tableOfContents }}>
                <CSSReset />
                <Global styles={globalStyles} />
                <Stack
                    bg={{ light: 'gray.50', dark: '#2A2B2F' }[colorMode]}
                    className='dokz visibleInPrint noMarginInPrint'
                    align='center'
                    minHeight='100%'
                    color={bodyColor[colorMode]}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fontWeight={fontWeight}
                    // color={colorMode == 'dark' ? 'white' : black}
                >
                    <Box
                        className='dokz visibleInPrint'
                        minHeight='100%'
                        position='relative'
                        w='100%'
                        maxWidth={maxPageWidth}
                    >
                        <NavBar
                            className='dokz hiddenInPrint'
                            logo={headerLogo}
                            items={headerItems}
                            tree={index}
                            height={NAVBAR_H + 'px'}
                            // maxW={PAGE_MAX_W}
                            position='fixed'
                            width='100%'
                            // mr='auto'
                            // top={0}
                            left={0}
                            right={0}
                        />
                        <SideNav
                            css={css`
                                -webkit-overflow-scrolling: touch;
                            `}
                            className='dokz hiddenInPrint'
                            alignSelf='flex-start'
                            position='fixed'
                            top={NAVBAR_H}
                            bottom={0}
                            fontSize='0.9em'
                            // fontWeight='500'
                            // left={0}
                            tree={index}
                            // height='100%'
                            width={SIDENAV_W}
                            display={['none', null, 'block']}
                            overflowY='auto'
                            overflowX='hidden'
                        />
                        <Stack
                            direction='row'
                            minHeight='100%'
                            className='dokz visibleInPrint noMarginInPrint'
                            align='stretch'
                            ml={['none', null, SIDENAV_W]}
                            // mr={['none', null, TABLE_OF_C_W + 30 + 'px']}
                            mt={[NAVBAR_H + 'px']}
                        >
                            <Stack
                                bg={
                                    { light: 'white', dark: '#2F3237' }[
                                        colorMode
                                    ]
                                }
                                // borderRadius='8px'
                                boxShadow='0 0 40px 10px rgba(0, 0, 0, 0.08)'
                                minHeight='100%'
                                className='dokz visibleInPrint mainContent'
                                direction='column'
                                align='stretch'
                                overflow='auto'
                                px={['10px', null, '30px', '40px']}
                                // spacing='10px'
                                flex='1'
                                minW='0'
                                borderRightWidth='1px'
                                borderLeftWidth='1px'
                            >
                                <Stack spacing='2em' align='stretch'>
                                    {props.children}
                                    <FooterButtons
                                        className='dokz hiddenInPrint'
                                        mt='60px !important'
                                        mb='2em !important'
                                        width='100%'
                                    />
                                    {footer}
                                </Stack>
                            </Stack>
                            <FloatingTableOfContents
                                className='dokz hiddenInPrint'
                                fontSize='0.9em'
                                // fontWeight='400'
                                position='sticky'
                                alignSelf='flex-start'
                                top={NAVBAR_H}
                                width={TABLE_OF_C_W + 'px'}
                                // right={0}
                                ml='auto'
                                height='auto'
                                display={['none', null, null, null, 'block']}
                                pt='20px'
                                opacity={0.8}
                                table={tableOfContents}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </TableOfContentsContext.Provider>
        </PropagatedThemeProvider>
    )
}

export function PropagatedThemeProvider({ theme, children }) {
    const existingTheme = useTheme()
    // console.log({ existingTheme: existingTheme.sizes })
    const merged = useMemo(() => {
        return merge(existingTheme, theme)
    }, [theme, existingTheme])
    return <ThemeProvider theme={merged}>{children}</ThemeProvider>
}
