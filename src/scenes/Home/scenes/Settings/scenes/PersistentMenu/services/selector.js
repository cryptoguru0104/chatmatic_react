export const getPersistentMenuState = state =>
  state.default.settings.persistentMenus;

export const getActivePersistentMenu = state => {
  const activeMenuId = getPersistentMenuState(state).activeMenuId;

  if (activeMenuId === null) {
    return getPersistentMenuState(state).currentMenu;
  }

  return (
    getPersistentMenuState(state).persistentMenus.menus.find(menu => {
      return menu.uid === activeMenuId;
    }) || {}
  );
};
