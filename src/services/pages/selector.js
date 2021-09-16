import { createSelector } from 'reselect';

const getPages = state => state.default.pages.pages;

export const getConnectedPages = createSelector(getPages, pages => {
  if (pages.length > 0) {
    return pages.filter(t => t.isConnected);
  } else {
    return [];
  }
});

export const filterConnectedPagesWithSearchString = createSelector(
  [getConnectedPages, state => state.default.scenes.dashboardPage.searchStr],
  (pages, searchStr) => {
    if (pages) {
      return pages.filter(t =>
        t.fbName.toLowerCase().includes(searchStr.toLowerCase())
      );
    } else {
      return [];
    }
  }
);
export const getPageFromId = createSelector(
  [
    getConnectedPages,
    (pageId) => {
      return pageId;
    }
  ],
  (pages, pageId) => {
    if (!pageId) {
      return null;
    } else {
      return pages.find(page => page.uid === parseInt(pageId, 10)) || {};
    }
  }
)
export const getPageFromUrl = createSelector(
  [
    getConnectedPages,
    (state, props) => {
      return props.match.params.id;
    }
  ],
  (pages, pageId) => {
    if (!pageId) {
      return null;
    } else {
      return pages.find(page => page.uid === parseInt(pageId, 10)) || {};
    }
  }
);

export const getPagePosts = createSelector(
  [getConnectedPages, (state, props) => props.match.params.id],
  (pages, pageId) => {
    const page = pages.find(page => page.uid === parseInt(pageId, 10));
    if (!page) return [];
    return page.posts || [];
  }
);

export const getPageTriggers = createSelector(
  [getConnectedPages, (state, props) => props.match.params.id],
  (pages, pageId) => {
    const page = pages.find(page => page.uid === parseInt(pageId, 10));
    if (!page) return [];
    return page.triggers || [];
  }
);
