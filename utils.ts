export const actionsToTargets = (model: any, actionObj: any) => {
    return Object.keys(actionObj).reduce((acc, key) => {
        acc[key] = function (...acc) {
            actionObj[key](model, ...acc)
        };
        return acc;
    }, {});  
};