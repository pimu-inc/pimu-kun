import { Command, Option, SubCommand } from 'discord-hono';

export const timeBuilder = new Command('time', '勤怠を打刻するよ').options(
  new SubCommand('create_project', '新しいプロジェクトを作成するよ').options(
    new Option('project_name', 'プロジェクト名').required()
  ),
  new SubCommand('start', '勤務を開始するよ').options(
    new Option('project_name', '勤務予定のプロジェクト').required(),
    new Option('memo', '仕事内容のメモ').required()
  ),
  new SubCommand('end', '勤務を終了するよ').options(new Option('project_name', '勤務中のプロジェクト').required()),
  new SubCommand('break_start', '休憩を開始するよ').options(
    new Option('project_name', '勤務中のプロジェクト').required()
  ),
  new SubCommand('break_end', '休憩を終了するよ').options(
    new Option('project_name', '勤務中のプロジェクト').required()
  ),
  new SubCommand('list', '既存のプロジェクト一覧を表示するよ')
);
