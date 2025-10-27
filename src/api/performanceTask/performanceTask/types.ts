export interface PerformanceTaskVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 法务支持id
   */
  legalSupportId: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName: string;

  /**
   * 任务月份（格式：YYYYMM，如202310）
   */
  taskMonth: string;

  /**
   * 月度业绩目标
   */
  performanceGoal: number;

  /**
   * 月度出访目标
   */
  visitGoal: number;

  /**
   * 已完成的月度业绩目标
   */
  achievedPerformanceGoal: number;

  /**
   * 已完成的月度出访目标
   */
  achievedVisitGoal: number;

}

export interface PerformanceTaskForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 法务支持id
   */
  legalSupportId?: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName?: string;

  /**
   * 任务月份（格式：YYYYMM，如202310）
   */
  taskMonth?: string;

  /**
   * 月度业绩目标
   */
  performanceGoal?: number;

  /**
   * 月度出访目标
   */
  visitGoal?: number;

  /**
   * 已完成的月度业绩目标
   */
  achievedPerformanceGoal?: number;

  /**
   * 已完成的月度出访目标
   */
  achievedVisitGoal?: number;

}

export interface PerformanceTaskQuery extends PageQuery {

  /**
   * 法务支持id
   */
  legalSupportId?: string | number;

  /**
   * 法务支持姓名
   */
  legalSupportName?: string;

  /**
   * 任务月份（格式：YYYYMM，如202310）
   */
  taskMonth?: string;

  /**
   * 月度业绩目标
   */
  performanceGoal?: number;

  /**
   * 月度出访目标
   */
  visitGoal?: number;

  /**
   * 已完成的月度业绩目标
   */
  achievedPerformanceGoal?: number;

  /**
   * 已完成的月度出访目标
   */
  achievedVisitGoal?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



